import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[80vh] place-items-center px-4 pt-24 text-center">
      <div>
        <p className="font-display text-[9rem] leading-none text-tomato">404</p>
        <h1 className="mt-4 font-display text-4xl">Cette page a trop mijoté.</h1>
        <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-cream">Retour à l&apos;accueil</Link>
      </div>
    </div>
  );
}
