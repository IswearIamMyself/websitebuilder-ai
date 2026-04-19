/* Vibbr logo components — SVG-based, no image dependency */

/** Just the icon square: dark rounded square with gradient "V" */
export function VibbrLogoIcon({ size = 28 }: { size?: number }) {
  const id = 'vgrad';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f97316" />
          <stop offset="50%"  stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* Dark rounded square background */}
      <rect width="28" height="28" rx="7" fill="#18181b" />
      {/* Bold "V" — polygon path */}
      <path
        d="M4 5 L10 5 L14 18 L18 5 L24 5 L14 24 Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

/** Icon + "Vibbr" wordmark side by side (white text — use on dark backgrounds) */
export function VibbrLogoMark({ textColor = 'text-white' }: { textColor?: string }) {
  return (
    <div className="flex items-center gap-2">
      <VibbrLogoIcon />
      <span className={`font-semibold text-base tracking-tight ${textColor}`}>Vibbr</span>
    </div>
  );
}

/** Icon + "Vibbr" wordmark for dark text (footers on white backgrounds) */
export function VibbrLogoMarkDark() {
  return <VibbrLogoMark textColor="text-zinc-900" />;
}

/** @deprecated use VibbrLogoIcon */
export function VibbrLogoHorizontal() {
  return <VibbrLogoMark />;
}
