/**
 * Build full URL for uploaded images (dev uses Vite proxy; prod may set VITE_API_URL).
 */
export function getUploadUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return base ? `${base}${path}` : path;
}
