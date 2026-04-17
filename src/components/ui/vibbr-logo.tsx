/* eslint-disable @next/next/no-img-element */

export function VibbrLogoIcon({ className }: { className?: string }) {
  return (
    <img src="/vibbr-icon.png" alt="Vibbr" className={`w-8 h-8 rounded-xl object-cover ${className ?? ''}`} />
  );
}

export function VibbrLogoHorizontal({ className }: { className?: string }) {
  return (
    <img src="/vibbr-logo-horizontal.png" alt="Vibbr" className={`h-8 w-auto ${className ?? ''}`} />
  );
}
