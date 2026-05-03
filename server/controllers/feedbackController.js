import Feedback from '../models/Feedback.js';

/**
 * Build filter query from query string (admin sees all; user sees own).
 */
function buildListQuery(req) {
  const query = {};

  if (req.user.role !== 'admin') {
    query.createdBy = req.user._id;
  }

  const { category, priority, status, rating, search } = req.query;

  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (status) query.status = status;
  if (rating !== undefined && rating !== '') {
    query.rating = Number(rating);
  }

  if (search && String(search).trim()) {
    const term = String(search).trim();
    query.$or = [
      { title: { $regex: term, $options: 'i' } },
      { message: { $regex: term, $options: 'i' } },
    ];
  }

  return query;
}

/**
 * Create feedback (optional image in req.file).
 */
export async function createFeedback(req, res, next) {
  try {
    const { title, category, priority, rating, message } = req.body;

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : '';

    const feedback = await Feedback.create({
      title,
      category,
      priority,
      rating: Number(rating),
      message,
      image: imagePath,
      createdBy: req.user._id,
    });

    await feedback.populate('createdBy', 'name email');

    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
}

/**
 * List feedback with pagination and filters.
 */
export async function listFeedback(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const mongoQuery = buildListQuery(req);

    const [items, total] = await Promise.all([
      Feedback.find(mongoQuery)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Feedback.countDocuments(mongoQuery),
    ]);

    res.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get single feedback by id (admin any; user own only).
 */
export async function getFeedbackById(req, res, next) {
  try {
    const feedback = await Feedback.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (
      req.user.role !== 'admin' &&
      feedback.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not allowed to view this feedback' });
    }

    res.json(feedback);
  } catch (err) {
    next(err);
  }
}

/**
 * Update own feedback (users cannot change status; admin uses admin route).
 */
export async function updateFeedback(req, res, next) {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own feedback' });
    }

    const { title, category, priority, rating, message } = req.body;

    if (title !== undefined) feedback.title = title;
    if (category !== undefined) feedback.category = category;
    if (priority !== undefined) feedback.priority = priority;
    if (rating !== undefined) feedback.rating = Number(rating);
    if (message !== undefined) feedback.message = message;

    if (req.file) {
      feedback.image = `/uploads/${req.file.filename}`;
    }

    await feedback.save();
    await feedback.populate('createdBy', 'name email');

    res.json(feedback);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete feedback (own for user; admin can delete any).
 */
export async function deleteFeedback(req, res, next) {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const isOwner = feedback.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed to delete this feedback' });
    }

    await feedback.deleteOne();
    res.json({ message: 'Feedback removed' });
  } catch (err) {
    next(err);
  }
}
