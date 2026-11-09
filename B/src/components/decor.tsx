/** Hand-drawn-feel brand decor: wren mark, plate divider, leaf sprig. */

export function WrenMark({ className = "", strokeWidth = 2.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {/* cocked tail */}
      <path d="M20.5 31.5C14.5 26 10 18.5 8.5 11.5" />
      <path d="M8.5 11.5c3.8.6 6.8 2.3 9 5" />
      {/* round body */}
      <path d="M20.5 31.5c-4.6 4.2-5.6 10-2 14.8 3.6 4.8 11 6.3 17 3.6 6.6-3 8.8-10.6 5.6-16.4-2.9-5.2-9.4-7.4-14.6-5.4-2.5 1-4.8 2.1-6 3.4Z" />
      {/* head & beak */}
      <path d="M41.1 33.5c1.5-1.9 2.5-4 2.9-6.4" />
      <path d="M44.2 25.5 55 28.4l-8.7 3.1" />
      <circle cx="44.6" cy="27.8" r="1.1" fill="currentColor" stroke="none" />
      {/* wing */}
      <path d="M27 39.5c3-2.6 7.6-2.9 10.8-.6" />
      {/* legs */}
      <path d="M27.5 50.6v6.4M25 57h5" />
      <path d="M34.5 50.2v6M32 56.2h5" />
    </svg>
  );
}

export function LeafSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M3 20C11 16 19 11 25 4" />
      <path d="M10 17c-3-1-5-3-5.5-6 3 0 5.5 1.5 6.5 4" />
      <path d="M17 13c-3-1-5-3-5.5-6 3 0 5.5 1.5 6.5 4" />
      <path d="M24 8C21.5 7 20 5.5 19.5 3c2.5.3 4.5 1.7 5.3 3.7" />
      <path d="M25 4c3-1 6-1.5 9-1-1.5 2.5-4 4-7 4.5" />
    </svg>
  );
}

/** Hand-drawn wavy divider with a tiny plate at center — the "plate divider". */
export function PlateDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M4 12c14-5 28 5 42 0s28 5 42 0 28-5 42 0" opacity="0.9" />
      <path d="M190 12c14-5 28 5 42 0s28 5 42 0 28-5 42 0" opacity="0.9" />
      {/* little plate */}
      <ellipse cx="160" cy="12" rx="13" ry="7" />
      <ellipse cx="160" cy="11.5" rx="6" ry="3" />
    </svg>
  );
}

/** Squiggle underline for italic display words. */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" aria-hidden="true" className={className} preserveAspectRatio="none">
      <path d="M2 8c10-5 18 3 28-1S48 2 58 6s18 4 28 0 22-4 32-1" />
    </svg>
  );
}
