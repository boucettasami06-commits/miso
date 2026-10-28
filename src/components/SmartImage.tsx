"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { unsplash } from "@/lib/data/recipes";

type Props = Omit<ImageProps, "src"> & { photo: string; emoji?: string };

/** Image Unsplash optimisée (AVIF/WebP, jusqu'à 3840 px) avec repli élégant si la photo est indisponible. */
export default function SmartImage({ photo, emoji = "🍽️", alt, className, ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={typeof alt === "string" ? alt : ""}
        className={`absolute inset-0 grid place-items-center bg-gradient-to-br from-saffron/60 via-tomato/40 to-sage/60 ${className ?? ""}`}
      >
        <span className="text-6xl drop-shadow-sm">{emoji}</span>
      </div>
    );
  }
  return (
    <Image
      src={unsplash(photo, 3840)}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
