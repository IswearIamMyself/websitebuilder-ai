'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Site {
  id: string;
  name: string;
  subdomain: string;
}

interface Profile {
  credits: number;
  plan: string;
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */

function HouseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" />
      <path d="M18 8H6a2 2 0 0 0-2 2v3a6 6 0 0 0 12 0v-3a2 2 0 0 0-2-2z" />
    </svg>
  );
}

function LayoutGridIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function GridShareIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function siteInitial(name: string): string {
  return (name.trim()[0] ?? 'S').toUpperCase();
}

/* ─── WorkspaceDropdown ──────────────────────────────────────────────────────── */

const planColors: Record<string, string> = {
  free: 'bg-white/10 text-zinc-400',
  starter: 'bg-blue-500/20 text-blue-400',
  pro: 'bg-orange-500/20 text-orange-400',
};

function WorkspaceDropdown({ plan, credits }: { plan: string; credits: number }) {
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const planColor = planColors[plan] ?? planColors['free']!;
  const fillPct = Math.min(100, Math.round((credits / 30) * 100));
  const [showComingSoon, setShowComingSoon] = useState(false);

  function handleCreateWorkspace() {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 2000);
  }

  return (
    <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-white/10 shadow-2xl z-50 p-3" style={{ background: '#1c1c1c' }}>
      {/* Workspace name + plan */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-white">My Workspace</span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${planColor}`}>{planLabel}</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-3">
        <Link href="/dashboard/settings" className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400 text-center transition-colors">
          Settings
        </Link>
        <button type="button" className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400 transition-colors">
          Invite
        </button>
      </div>

      {/* Credits */}
      <div className="p-3 rounded-lg bg-white/5 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">Credits</span>
          <span className="text-sm font-semibold text-orange-400">{credits} left</span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${fillPct}%` }} />
        </div>
      </div>

      {/* Workspace list */}
      <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-2">All workspaces</p>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
        <span className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">V</span>
        <span className="text-sm text-zinc-300 flex-1 truncate">My Workspace</span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${planColor}`}>{planLabel}</span>
        <CheckIcon />
      </div>

      {/* Create new */}
      <button
        type="button"
        onClick={handleCreateWorkspace}
        className="flex items-center gap-2 w-full px-2 py-2 mt-1 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <PlusIcon />
        {showComingSoon ? <span className="text-zinc-500 italic text-xs">Coming soon</span> : 'Create new workspace'}
      </button>

      {/* What's new */}
      <div className="mt-2 pt-2 border-t border-white/5">
        <button type="button" className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
          <span className="text-sm text-zinc-400 hover:text-white transition-colors">What&apos;s new</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────────── */

function Sidebar({
  sites,
  profile,
  email,
  isOpen,
  onClose,
}: {
  sites: Site[];
  profile: Profile;
  email: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const recentSites = sites.slice(0, 3);

  return (
    <aside
      className={[
        'fixed left-0 top-0 w-64 h-screen z-40 flex flex-col',
        'transition-transform duration-300 ease-in-out',
        'border-r border-white/5',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ].join(' ')}
      style={{ background: '#111111' }}
    >
      {/* ── Top section ── */}
      <div className="p-3 shrink-0">
        {/* Logo row */}
        <div className="flex items-center justify-between mb-1">
          <Link href="/dashboard" className="flex items-center gap-2 py-1 px-1 rounded-lg hover:bg-white/5 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/vibbr-icon.png" alt="Vibbr" className="w-6 h-6 rounded-md object-cover" />
            <span className="font-semibold text-white text-sm">Vibbr</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="md:flex hidden p-1 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <XIcon />
          </button>
        </div>

        {/* Workspace selector */}
        <div className="relative mt-1" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 w-full rounded-lg px-3 py-2 hover:bg-[#222] transition-colors"
            style={{ background: '#1a1a1a' }}
          >
            <span className="text-white text-sm font-medium flex-1 text-left truncate">My Workspace</span>
            <ChevronDownIcon />
          </button>
          {dropdownOpen && (
            <WorkspaceDropdown plan={profile.plan} credits={profile.credits} />
          )}
        </div>
      </div>

      {/* ── Middle nav ── */}
      <div className="px-2 mt-2 flex-1 overflow-y-auto flex flex-col gap-0.5">
        {/* Main nav */}
        <Link
          href="/dashboard"
          onClick={onClose}
          className={[
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors',
            pathname === '/dashboard' ? 'bg-white/8 text-white' : 'text-zinc-300 hover:bg-white/5 hover:text-white',
          ].join(' ')}
        >
          <HouseIcon />
          Home
        </Link>

        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors"
        >
          <SearchIcon />
          <span className="flex-1 text-left">Search</span>
          <kbd className="text-[10px] px-1 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-600 font-mono">⌘K</kbd>
        </button>

        <Link
          href="/blog"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors"
        >
          <BookOpenIcon />
          Resources
        </Link>

        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors"
        >
          <PlugIcon />
          Connectors
        </button>

        {/* Projects section */}
        <p className="mt-4 px-3 mb-1 text-[11px] text-zinc-600 font-medium uppercase tracking-wider">Projects</p>

        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LayoutGridIcon />
          All projects
        </Link>
        <button type="button" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors">
          <StarIcon />
          Starred
        </button>
        <button type="button" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors">
          <UserIcon />
          Created by me
        </button>
        <button type="button" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors">
          <UsersIcon />
          Shared with me
        </button>

        {/* Recents section */}
        {recentSites.length > 0 && (
          <>
            <p className="mt-4 px-3 mb-1 text-[11px] text-zinc-600 font-medium uppercase tracking-wider">Recents</p>
            {recentSites.map((site) => (
              <Link
                key={site.id}
                href={`/dashboard/${site.id}`}
                onClick={onClose}
                className={[
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  pathname === `/dashboard/${site.id}`
                    ? 'bg-white/8 text-white'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                <span className="w-5 h-5 rounded-md bg-orange-500/80 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {siteInitial(site.name)}
                </span>
                <span className="truncate">{site.name}</span>
              </Link>
            ))}
          </>
        )}
      </div>

      {/* ── Bottom section ── */}
      <div className="p-3 mt-auto flex flex-col gap-2 shrink-0">
        {/* Share Vibbr */}
        <button
          type="button"
          className="w-full rounded-xl p-3 text-left cursor-pointer hover:bg-[#222] transition-colors"
          style={{ background: '#1a1a1a' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-white text-xs font-medium">Share Vibbr</span>
            <GridShareIcon />
          </div>
          <p className="text-zinc-600 text-[11px] mt-0.5">Earn credits per referral</p>
        </button>

        {/* Upgrade to Pro (free plan only) */}
        {profile.plan === 'free' && (
          <Link
            href="/dashboard/upgrade"
            className="w-full rounded-xl p-3 text-left cursor-pointer hover:bg-[#222] transition-colors block"
            style={{ background: '#1a1a1a' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-medium">Upgrade to Pro</span>
              <LightningIcon />
            </div>
            <p className="text-zinc-600 text-[11px] mt-0.5">Unlock more generations</p>
          </Link>
        )}

        {/* User row */}
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <span className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {(email[0] ?? '?').toUpperCase()}
          </span>
          <span className="text-zinc-400 text-xs truncate flex-1">{email}</span>
          <MessageIcon />
        </div>
      </div>
    </aside>
  );
}

/* ─── Layout ─────────────────────────────────────────────────────────────────── */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const [sites, setSites] = useState<Site[]>([]);
  const [profile, setProfile] = useState<Profile>({ credits: 0, plan: 'free' });
  const [email, setEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? '');

      const [sitesRes, profileRes] = await Promise.all([
        supabase.from('sites').select('id, name, subdomain').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('credits, plan').eq('id', user.id).single(),
      ]);

      if (sitesRes.data) setSites(sitesRes.data as Site[]);
      if (profileRes.data) setProfile(profileRes.data as Profile);
    }
    load();
  }, []);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-h-screen" style={{ background: '#0f0f0f' }}>
        <Sidebar
          sites={sites}
          profile={profile}
          email={email}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          {/* Mobile top bar */}
          <div
            className="md:hidden flex items-center h-12 px-4 border-b border-white/5 sticky top-0 z-20 shrink-0"
            style={{ background: '#111111' }}
          >
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Open sidebar"
            >
              <HamburgerIcon />
            </button>
          </div>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
