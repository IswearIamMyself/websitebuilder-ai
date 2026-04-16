export default function VibbrLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/vibbr-icon.png"
        alt="Vibbr"
        className="w-8 h-8 rounded-xl object-cover"
      />
      <span className="font-bold text-white text-lg tracking-tight">Vibbr</span>
    </div>
  );
}
