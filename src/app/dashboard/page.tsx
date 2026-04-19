'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { VibbrLogoIcon } from '@/components/ui/vibbr-logo';

/* ─── Constants ──────────────────────────────────────────────────────────────── */

const LOADING_MESSAGES = [
  'Writing your HTML...',
  'Styling with CSS...',
  'Adding JavaScript...',
  'Optimizing for SEO...',
  'Almost ready...',
];

const CHIPS = [
  'Landing page for a Muay Thai gym',
  'Portfolio for a freelance designer',
  'Restaurant with online menu',
  'Agency site with case studies',
];

const TABS = ['My projects', 'Recently viewed', 'Starred', 'Most visitors today', 'Templates'] as const;
type Tab = (typeof TABS)[number];

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
  'linear-gradient(135deg, #ff9a9e, #fad0c4)',
];

const HERO_GRADIENT =
  'linear-gradient(170deg, #0d0d1a 0%, #1a0d2e 15%, #2d1b4e 28%, #6b2d6b 45%, #c2185b 62%, #e91e8c 75%, #f97316 88%, #ff8c42 100%)';

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface Site {
  id: string;
  name: string;
  subdomain: string;
  created_at: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function cardGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash * 31) + seed.charCodeAt(i)) & 0x7fffffff;
  }
  return CARD_GRADIENTS[hash % CARD_GRADIENTS.length]!;
}

function firstNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
}

function daysAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

/* ─── Generating overlay ─────────────────────────────────────────────────────── */

function GeneratingOverlay({ step }: { step: number }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6" style={{ background: HERO_GRADIENT, opacity: 0.97 }}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-2">
        <VibbrLogoIcon size={40} />
        <span className="text-white font-bold text-2xl tracking-tight">Vibbr</span>
      </div>

      {/* Spinner */}
      <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-white animate-spin" />

      {/* Status text */}
      <p className="text-white text-xl font-medium text-center">{LOADING_MESSAGES[step]}</p>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {LOADING_MESSAGES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-white' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Site card ──────────────────────────────────────────────────────────────── */

function SiteCard({ site }: { site: Site }) {
  const gradient = cardGradient(site.subdomain);
  const initial = (site.name.trim()[0] ?? 'S').toUpperCase();

  return (
    <Link
      href={`/dashboard/${site.id}`}
      className="bg-[#1a1a1a] rounded-2xl overflow-hidden cursor-pointer hover:ring-1 hover:ring-white/10 transition-all block group"
    >
      {/* Card top — gradient + fake browser */}
      <div className="h-40 relative overflow-hidden" style={{ background: gradient }}>
        {/* Published pill */}
        <div className="absolute top-3 right-3 bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/20">
          Published
        </div>

        {/* Fake browser chrome */}
        <div className="absolute bottom-0 left-2 right-2 bg-white rounded-t-lg h-24 p-3 shadow-lg">
          <div className="flex items-center gap-1 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <div className="flex-1 ml-1 bg-zinc-100 rounded-sm h-2.5 flex items-center px-1">
              <span className="text-[7px] text-zinc-400 truncate">{site.subdomain}.vibbr.app</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-700 font-medium truncate">{site.name}</p>
          <p className="text-[9px] text-zinc-400 mt-0.5 truncate">{site.subdomain}.vibbr.app</p>
        </div>
      </div>

      {/* Card bottom */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: gradient }}
          >
            {initial}
          </span>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{site.name}</p>
            <p className="text-zinc-600 text-xs mt-0.5">Edited {daysAgo(site.created_at)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Template card ──────────────────────────────────────────────────────────── */

const TEMPLATES = [
  {
    label: 'Moving Company',
    gradient: 'linear-gradient(135deg, #f97316, #fbbf24)',
    prompt: 'Moving company website for a local moving and storage business. Include a hero section, list of services (local moves, long-distance, storage), pricing tiers, customer testimonials, and a contact form with a "Get a free quote" call to action.',
  },
  {
    label: 'Personal Portfolio',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    prompt: 'Personal portfolio website for a freelance web designer. Include a hero section with a short bio, a projects gallery with case study previews, a skills section, client testimonials, and a contact form.',
  },
  {
    label: 'Restaurant',
    gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
    prompt: 'Restaurant website for an upscale Italian restaurant. Include an atmospheric hero section, a menu with categories, an online reservations section, location map with address and opening hours, and a gallery of signature dishes.',
  },
];

function TemplateCard({ label, gradient, prompt, onUse }: { label: string; gradient: string; prompt: string; onUse: (p: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onUse(prompt)}
      className="bg-[#1a1a1a] rounded-2xl overflow-hidden cursor-pointer hover:ring-1 hover:ring-white/15 transition-all text-left group w-full"
    >
      <div className="h-40 relative" style={{ background: gradient }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-black/30 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm group-hover:bg-black/50 transition-colors">
            Use template →
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-zinc-600 text-xs mt-0.5">Click to generate</p>
      </div>
    </button>
  );
}

/* ─── Dashboard content ──────────────────────────────────────────────────────── */

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [sites, setSites] = useState<Site[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('My projects');

  const autoSubmitFiredRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? '');
      const { data } = await supabase
        .from('sites')
        .select('id, name, subdomain, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setSites(data as Site[]);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Auto-submit from URL param
  useEffect(() => {
    if (loading) return;
    if (autoSubmitFiredRef.current) return;
    const prompt = searchParams.get('prompt');
    if (!prompt) return;
    autoSubmitFiredRef.current = true;
    const timer = setTimeout(() => handleSend(prompt), 500);
    return () => clearTimeout(timer);
  }, [loading, searchParams]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function handleSend(message: string) {
    if (!message.trim()) return;
    setError(null);
    setLoadingStep(0);
    setGenerating(true);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, LOADING_MESSAGES.length - 1));
    }, 2000);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await res.json() as { siteId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');
      router.push(`/dashboard/${data.siteId}`);
    } catch (e) {
      setGenerating(false);
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#0f0f0f' }}>
        <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const hasSites = sites.length > 0;
  const firstName = email ? firstNameFromEmail(email) : '';

  return (
    <>
      {/* Generating overlay */}
      {generating && <GeneratingOverlay step={loadingStep} />}

      {/* ── Hero gradient section ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: HERO_GRADIENT,
          minHeight: hasSites ? '50vh' : '100vh',
        }}
      >
        {/* Content */}
        <div
          className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ minHeight: hasSites ? '50vh' : '100vh' }}
        >
          <h1 className="text-white text-3xl font-semibold mb-6">
            {firstName ? `Ready to build, ${firstName}?` : 'What are we building today?'}
          </h1>

          <div className="max-w-2xl w-full">
            <div
              className="rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              style={{ background: 'rgba(28,28,30,0.85)', backdropFilter: 'blur(12px)' }}
            >
              <PromptInputBox
                onSend={handleSend}
                isLoading={generating}
                placeholder="Describe the site you want to build..."
              />
            </div>

            {error && (
              <div className="mt-3 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <span>{error}</span>
                <button type="button" onClick={() => setError(null)} className="text-xs font-medium text-red-300 hover:text-red-200 shrink-0 underline">
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Chips — only when no sites */}
          {!hasSites && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSend(chip)}
                  className="px-4 py-2 rounded-full text-sm text-white hover:text-white cursor-pointer border border-white/20 hover:bg-white/15 transition-colors backdrop-blur-sm bg-white/10"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gradient fade into projects area */}
        {hasSites && (
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #0f0f0f)' }} />
        )}
      </div>

      {/* ── Projects section ── */}
      {hasSites ? (
        <div className="bg-[#0f0f0f] px-6 py-8 min-h-screen">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 overflow-x-auto">
            <div className="flex gap-1 shrink-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={[
                    'text-sm px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors',
                    activeTab === tab
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5',
                  ].join(' ')}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button type="button" className="text-zinc-400 text-sm hover:text-white cursor-pointer transition-colors shrink-0 ml-4">
              Browse all →
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>

          {/* Templates below grid */}
          <div className="mt-10 border-t border-white/5 pt-8">
            <p className="text-zinc-600 text-sm font-medium uppercase tracking-wider mb-6">Templates</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map((t) => (
                <TemplateCard key={t.label} label={t.label} gradient={t.gradient} prompt={t.prompt} onUse={handleSend} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Empty state — template cards below hero ── */
        <div className="bg-[#0f0f0f] px-6 py-12">
          <p className="text-zinc-600 text-sm font-medium uppercase tracking-wider mb-6">Templates</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <TemplateCard key={t.label} label={t.label} gradient={t.gradient} prompt={t.prompt} onUse={handleSend} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f0f' }}>
          <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
