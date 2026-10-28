import { STORE_LOGOS } from "@/lib/data/store-logos";
import type { Store } from "@/lib/types";

/** Les couleurs trop claires (ex. jaune Netto) passent en encre pour rester lisibles sur fond crème. */
function readable(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.7 ? "var(--color-ink)" : hex;
}

/** Logo officiel de l'enseigne quand il est disponible, sinon une pastille à ses couleurs. */
export default function StoreLogo({ store, size = 36, compact = false }: { store: Store; size?: number; compact?: boolean }) {
  const logo = STORE_LOGOS[store.id];
  // Ces logos sont des logotypes horizontaux : illisibles en vignette carrée, on garde le nom seul
  const wordmarkOnly = store.id === "intermarche" || store.id === "leader-price";
  return (
    <span className={`inline-flex items-center whitespace-nowrap ${compact ? "max-w-full gap-2" : "gap-3"}`}>
      {wordmarkOnly ? null : logo ? (
        <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={`Logo ${store.name}`} fill={logo.hex}>
          <path d={logo.path} />
        </svg>
      ) : (
        <span
          aria-hidden
          className="grid shrink-0 place-items-center rounded-lg font-display font-extrabold"
          style={{ width: size, height: size, background: store.color, color: readable(store.color) === store.color ? "#fff" : "var(--color-ink)", fontSize: size * 0.5 }}
        >
          {store.name.replace(/^(Hyper|Super) /, "").charAt(0)}
        </span>
      )}
      <span className={compact ? "truncate font-display text-base font-bold" : "font-display text-xl font-bold sm:text-2xl"} style={{ color: readable(logo?.hex ?? store.color) }}>
        {store.name}
      </span>
    </span>
  );
}
