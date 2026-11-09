/**
 * Graceful image fallback: if a photo ever fails to load, swap in a calm
 * on-brand SVG placeholder (wheat background, hand-drawn plate) so the
 * layout never shows a broken image.
 */
export const FALLBACK_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#F2E6CF"/><g fill="none" stroke="#2F4A3A" stroke-width="5" stroke-linecap="round"><ellipse cx="400" cy="300" rx="130" ry="86"/><ellipse cx="400" cy="294" rx="64" ry="36"/><path d="M330 300c40-18 80 18 120 0s60-14 90-4" stroke="#7C8B5A" stroke-width="4" opacity="0.65"/></g></svg>`
  );

export function withFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG;
}
