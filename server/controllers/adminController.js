import Feedback from '../models/Feedback.js';
import { sendStatusChangeEmail } from '../utils/sendMail.js';

/**
 * Dashboard stats for analytics cards.
 */
export async function getStats(req, res, next) {
  try {
    const [total, resolved, pending, agg] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.countDocuments({ status: 'resolved' }),
      Feedback.countDocuments({ status: 'pending' }),
      Feedback.aggregate([
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
          },
        },
      ]),
    ]);

    const averageRating =
      agg.length && agg[0].avgRating != null
        ? Math.round(agg[0].avgRating * 10) / 10
        : 0;

    res.json({
      totalFeedback: total,
      resolvedIssues: resolved,
      pendingReports: pending,
      averageRating,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update feedback status (admin only). Optionally notify user by email.
 */
export async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'in_review', 'resolved'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${allowed.join(', ')}`,
      });
    }

    const feedback = await Feedback.findById(req.params.id).populate(
      'createdBy',
      'email name'
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const previousStatus = feedback.status;
    feedback.status = status;
    await feedback.save();

    if (previousStatus !== status && feedback.createdBy?.email) {
      try {
        await sendStatusChangeEmail(
          feedback.createdBy.email,
          feedback.title,
          status
        );
      } catch (e) {
        console.warn('Email notification failed:', e.message);
      }
    }

    await feedback.populate('createdBy', 'name email');
    res.json(feedback);
  } catch (err) {
    next(err);
  }
}
