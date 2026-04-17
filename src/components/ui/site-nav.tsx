/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

export default function SiteNav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 h-14 border-b border-white/5 backdrop-blur-md z-50 flex items-center justify-between px-6"
      style={{ background: 'rgba(15,15,18,0.8)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <img src="/vibbr-icon.png" alt="Vibbr" className="w-7 h-7 rounded-lg object-cover" />
        <span className="ml-2 font-semibold text-white text-base">Vibbr</span>
      </Link>

      {/* Center links — hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Pricing
        </Link>
        <Link href="/blog" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Blog
        </Link>
        <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Docs
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <Link
          href="/auth?mode=signin"
          className="text-sm text-zinc-400 hover:text-white px-4 py-2 transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/auth?mode=signup"
          className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          Get started
        </Link>
      </div>
    </nav>
  );
}
