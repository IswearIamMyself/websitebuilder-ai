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

function HomeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
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

function SearchIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
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

const planColors: Record<string, string> = {
  free: 'bg-white/10 text-zinc-400',
  starter: 'bg-blue-500/20 text-blue-400',
  pro: 'bg-orange-500/20 text-orange-400',
};

const STARTING_CREDITS: Record<string, number> = {
  free: 1,
  starter: 30,
  pro: 100,
};

function initials(email: string): string {
  return (email[0] ?? '?').toUpperCase();
}

function siteInitial(name: string): string {
  return (name.trim()[0] ?? 'S').toUpperCase();
}

/* ─── WorkspaceDropdown ──────────────────────────────────────────────────────── */

function WorkspaceDropdown({
  plan,
  credits,
}: {
  plan: string;
  credits: number;
}) {
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const planColor = planColors[plan] ?? planColors.free;
  const fillPct = Math.min(100, Math.round((credits / 30) * 100));
  const [showComingSoon, setShowComingSoon] = useState(false);

  function handleCreateWorkspace() {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 2000);
  }

  return (
    <div
      className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-white/10 shadow-2xl z-50 p-3"
      style={{ background: '#1c1c1c' }}
    >
      {/* Workspace name + plan */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-white">My Workspace</span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${planColor}`}>
          {planLabel}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-3">
        <Link
          href="/dashboard/settings"
          className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400 text-center transition-colors"
        >
          Settings
        </Link>
        <button
          type="button"
          className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400 transition-colors"
        >
          Invite members
        </button>
      </div>

      {/* Credits */}
      <div className="p-3 rounded-lg bg-white/5 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">Credits</span>
          <span className="text-sm text-orange-400">{credits} left →</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-orange-500 transition-all"
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      {/* Workspace list */}
      <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-2">
        All workspaces
      </p>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
        <span className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
          V
        </span>
        <span className="text-sm text-zinc-300 flex-1 truncate">My Workspace</span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${planColor}`}>
          {planLabel}
        </span>
        <CheckIcon />
      </div>

      {/* Create new */}
      <button
        type="button"
        onClick={handleCreateWorkspace}
        className="flex items-center gap-2 w-full px-2 py-2 mt-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <PlusIcon />
        {showComingSoon ? (
          <span className="text-zinc-500 italic">Coming soon</span>
        ) : (
          'Create new workspace'
        )}
      </button>
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────────── */

function Sidebar({
  sites,
  profile,
  email,
}: {
  sites: Site[];
  profile: Profile;
  email: string;
}) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const planLabel = profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1);
  const planColor = planColors[profile.plan] ?? planColors.free;

  return (
    <aside
      className="fixed left-0 top-0 w-64 h-screen border-r border-white/5 flex flex-col z-30"
      style={{ background: '#141414' }}
    >
      {/* ── Logo ── */}
      <div className="px-4 py-3 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vibbr-icon.png" alt="Vibbr" className="w-7 h-7 rounded-lg object-cover" />
          <span className="font-semibold text-white text-base">Vibbr</span>
        </Link>
      </div>

      {/* ── Workspace selector ── */}
      <div className="p-3 border-b border-white/5 relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <span className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            V
          </span>
          <span className="text-sm text-white font-medium flex-1 text-left truncate">My Workspace</span>
          <ChevronDownIcon />
        </button>

        {dropdownOpen && (
          <WorkspaceDropdown
            plan={profile.plan}
            credits={profile.credits}
          />
        )}
      </div>

      {/* ── Middle: search + nav ── */}
      <div className="px-2 py-3 flex-1 overflow-y-auto">
        {/* Search */}
        <div className="flex items-center gap-2 mx-1 mb-2 px-3 py-2 rounded-lg bg-white/5 text-zinc-400">
          <SearchIcon />
          <span className="text-sm">Search...</span>
        </div>

        {/* Nav */}
        <nav className="space-y-0.5">
          <Link
            href="/dashboard"
            className={[
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === '/dashboard'
                ? 'bg-white/8 text-white'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white',
            ].join(' ')}
          >
            <HomeIcon />
            Home
          </Link>
          <button
            type="button"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <StarIcon />
            Starred
          </button>
        </nav>

        {/* Projects */}
        <p className="mt-4 px-3 mb-1 text-xs text-zinc-600 font-medium uppercase tracking-wider">
          Projects
        </p>
        <div className="space-y-0.5">
          {sites.length === 0 ? (
            <p className="px-3 py-2 text-xs text-zinc-600">No sites yet</p>
          ) : (
            sites.map((site) => (
              <Link
                key={site.id}
                href={`/dashboard/${site.id}`}
                className={[
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                  pathname === `/dashboard/${site.id}`
                    ? 'bg-white/8 text-white'
                    : 'text-zinc-300 hover:bg-white/5',
                ].join(' ')}
              >
                <span className="w-5 h-5 rounded-md bg-orange-500/80 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {siteInitial(site.name)}
                </span>
                <span className="truncate">{site.name}</span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* ── Bottom: user ── */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
            {initials(email)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-zinc-300 truncate">{email}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${planColor}`}>
                {planLabel}
              </span>
              {profile.plan === 'free' && (
                <Link
                  href="/dashboard/upgrade"
                  className="text-[10px] text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Upgrade →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Layout ─────────────────────────────────────────────────────────────────── */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = createClient();

  const [sites, setSites] = useState<Site[]>([]);
  const [profile, setProfile] = useState<Profile>({ credits: 0, plan: 'free' });
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? '');

      const [sitesRes, profileRes] = await Promise.all([
        supabase
          .from('sites')
          .select('id, name, subdomain')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('credits, plan')
          .eq('id', user.id)
          .single(),
      ]);

      if (sitesRes.data) setSites(sitesRes.data as Site[]);
      if (profileRes.data) setProfile(profileRes.data as Profile);
    }
    load();
  }, []);

  // Derive a breadcrumb title from the current path
  let pageTitle = 'Dashboard';
  if (pathname?.includes('/upgrade')) pageTitle = 'Upgrade';
  else if (pathname?.includes('/domain')) pageTitle = 'Domain Settings';
  else if (pathname?.match(/\/dashboard\/[^/]+$/)) pageTitle = 'Site Editor';

  return (
    <div className="flex min-h-screen" style={{ background: '#0f0f0f' }}>
      <Sidebar sites={sites} profile={profile} email={email} />

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="h-14 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-20"
          style={{ background: '#0f0f0f' }}
        >
          <span className="text-sm text-zinc-400">{pageTitle}</span>
          <div className="flex items-center gap-3">
            <span
              className={[
                'text-xs font-semibold px-3 py-1 rounded-full',
                profile.credits < 5
                  ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                  : 'bg-white/5 text-zinc-400 border border-white/8',
              ].join(' ')}
            >
              {profile.credits} credit{profile.credits !== 1 ? 's' : ''}
            </span>
            {email && (
              <span className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white shrink-0 select-none">
                {(email[0] ?? '?').toUpperCase()}
              </span>
            )}
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
