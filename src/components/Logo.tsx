export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-tight ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
        <circle cx="20" cy="22" r="15" fill="#ff5a1f" />
        <path d="M9 20h22" stroke="#fafaf5" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 10c0-3 3-3 3-6M20 10c0-3 3-3 3-6M26 10c0-3 3-3 3-6" stroke="#c6f432" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </svg>
      <span>
        BUDGEMY<span className="text-tomato">.</span>
      </span>
    </span>
  );
}
