import jwt from 'jsonwebtoken';

/**
 * Create a signed JWT for the authenticated user.
 */
export function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}
