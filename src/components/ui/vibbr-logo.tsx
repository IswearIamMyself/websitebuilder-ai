/* eslint-disable @next/next/no-img-element */

export function VibbrLogoHorizontal({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <img src="/vibbr-icon.png" alt="Vibbr" className="w-8 h-8 rounded-xl object-cover" />
      <span className="font-bold text-white text-lg tracking-tight">Vibbr</span>
    </div>
  );
}

export function VibbrLogoIcon({ className }: { className?: string }) {
  return (
    <img src="/vibbr-icon.png" alt="Vibbr" className={`rounded-xl object-cover ${className ?? 'w-8 h-8'}`} />
  );
}
