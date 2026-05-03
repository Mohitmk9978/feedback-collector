import nodemailer from 'nodemailer';

/**
 * Send email if SMTP is configured; otherwise no-op.
 */
export async function sendStatusChangeEmail(to, feedbackTitle, newStatus) {
  const host = process.env.SMTP_HOST;
  if (!host || !process.env.SMTP_USER) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const statusLabel = {
    pending: 'Pending',
    in_review: 'In Review',
    resolved: 'Resolved',
  }[newStatus] || newStatus;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Feedback Collector <noreply@example.com>',
    to,
    subject: `Feedback status updated: ${feedbackTitle}`,
    text: `Your feedback "${feedbackTitle}" is now: ${statusLabel}.`,
    html: `<p>Your feedback <strong>${feedbackTitle}</strong> is now: <strong>${statusLabel}</strong>.</p>`,
  });
}
