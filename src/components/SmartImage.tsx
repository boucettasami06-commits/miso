"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { unsplash } from "@/lib/data/recipes";

type Props = Omit<ImageProps, "src"> & { photo: string; emoji?: string };

/** Image Unsplash optimisée (AVIF/WebP, jusqu'à 3840 px) avec repli élégant si la photo est indisponible. */
export default function SmartImage({ photo, emoji = "🍽️", alt, className, ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  // Pas de photo fiable pour ce plat (ou chargement impossible) : vignette illustrée plutôt qu'une photo trompeuse
  if (failed || !photo) {
    return (
      <div
        role="img"
        aria-label={typeof alt === "string" ? alt : ""}
        className={`absolute inset-0 grid place-items-center overflow-hidden bg-gradient-to-br from-saffron/50 via-cream-2 to-tomato/25 ${className ?? ""}`}
        style={{ containerType: "size" }}
      >
        <span aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40" />
        <span aria-hidden className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-sage/20" />
        <span className="relative drop-shadow-md" style={{ fontSize: "min(6rem, 42cqmin)" }}>{emoji}</span>
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
