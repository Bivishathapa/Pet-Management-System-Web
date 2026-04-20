export function profileImageUrl(relativePath) {
  if (!relativePath) return null;
  const base = (import.meta.env.VITE_BASE_URL || '').replace(/\/$/, '');
  const path = String(relativePath).replace(/^\//, '');
  if (!base) return `/${path}`;
  return `${base}/${path}`;
}
