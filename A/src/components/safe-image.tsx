"use client";

import { useState } from "react";
import { PlateIcon } from "./brand";

type SafeImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  sizes?: string;
  fallbackLabel?: string;
  fallbackClassName?: string;
};

/**
 * Image with explicit dimensions and a graceful in-page fallback.
 * If the remote photo cannot load, an illustrated plate panel is shown instead,
 * so the layout never exposes a broken-image icon.
 */
export function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  imgClassName = "",
  eager = false,
  sizes,
  fallbackLabel = "Illustration of a balanced plate",
  fallbackClassName = "",
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const ratio = `${width} / ${height}`;

  return (
    <div className={`relative overflow-hidden bg-wheat ${className}`} style={{ aspectRatio: ratio }}>
      {failed ? (
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-wheat px-6 text-center ${fallbackClassName}`}
          role="img"
          aria-label={fallbackLabel}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-olive/40 text-olive-deep">
            <PlateIcon className="h-8 w-8" />
          </span>
          <span className="max-w-[18rem] font-serif text-lg leading-snug text-sage">
            {fallbackLabel}
          </span>
          <span className="text-xs uppercase tracking-[0.16em] text-olive-deep">
            Wrenfield Nutrition
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- remote editorial photography with a runtime fallback
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
