'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const SOLUTIONS = [
  {
    icon: '🏢',
    bg: 'bg-orange-500/10',
    title: 'For agencies',
    sub: 'Build client sites 10x faster',
    href: '/solutions/agencies',
  },
  {
    icon: '🏪',
    bg: 'bg-blue-500/10',
    title: 'For businesses',
    sub: 'Get online without a developer',
    href: '/solutions/businesses',
  },
  {
    icon: '📈',
    bg: 'bg-green-500/10',
    title: 'For marketers',
    sub: 'SEO landing pages that convert',
    href: '/solutions/marketers',
  },
  {
    icon: '🚀',
    bg: 'bg-purple-500/10',
    title: 'For founders',
    sub: 'Launch your MVP fast',
    href: '/solutions/founders',
  },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-14 border-b border-white/5 backdrop-blur-md z-50 flex items-center justify-between px-6"
      style={{ background: 'rgba(15,15,18,0.8)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center shrink-0">
        <img src="/vibbr-icon.png" alt="Vibbr" className="w-7 h-7 rounded-lg object-cover" />
        <span className="ml-2 font-semibold text-white text-base tracking-tight">Vibbr</span>
      </Link>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-6">

        {/* Solutions dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Solutions
            <ChevronDown
              className="w-3.5 h-3.5 transition-transform duration-200"
              style={{ transform: open ? 'rotate(180deg)' : 'none' }}
            />
          </button>

          {open && (
            <div
              className="absolute top-full left-0 mt-2 w-80 rounded-2xl border border-white/10 shadow-2xl p-6 z-50"
              style={{ background: '#1a1a1a' }}
            >
              {SOLUTIONS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <span className={`${s.bg} rounded-lg p-2 text-base shrink-0`}>{s.icon}</span>
                  <div>
                    <p className="font-medium text-white text-sm">{s.title}</p>
                    <p className="text-zinc-400 text-xs mt-0.5">{s.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

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
