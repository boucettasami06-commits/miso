import Image from "next/image";

/** Logo officiel BUDGEMY (icône + logotype). `light` = version texte crème pour les fonds sombres. */
export default function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <Image
      src={light ? "/brand/budgemy-logo-light.png" : "/brand/budgemy-logo.png"}
      alt="Budgemy"
      width={1874}
      height={587}
      priority={!light}
      className={`h-10 w-auto md:h-12 ${className}`}
    />
  );
}
