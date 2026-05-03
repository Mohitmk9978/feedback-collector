/**
 * Central Express error handler (must have 4 args).
 */
export function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);

  // Multer file errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large (max 5MB)' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id' });
  }

  const status = err.statusCode || err.status || 500;
  const message =
    err.message || 'Something went wrong on the server';

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}
