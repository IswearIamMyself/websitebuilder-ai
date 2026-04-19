'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { VibbrLogoMark, VibbrLogoMarkDark } from '@/components/ui/vibbr-logo';

/* ─── CSS ────────────────────────────────────────────────────────────────────── */

const css = `
  @keyframes auroraShift {
    0%   { transform: scale(1) translate(0, 0); }
    50%  { transform: scale(1.06) translate(1.5%, -1%); }
    100% { transform: scale(1) translate(0, 0); }
  }
  @keyframes slide {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
`;

const AURORA = [
  'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(99,60,180,0.8) 0%, transparent 60%)',
  'radial-gradient(ellipse 60% 80% at 70% 60%, rgba(219,39,119,0.7) 0%, transparent 55%)',
  'radial-gradient(ellipse 50% 50% at 50% 80%, rgba(249,115,22,0.5) 0%, transparent 60%)',
  '#0a0a0f',
].join(', ');

/* ─── Data ───────────────────────────────────────────────────────────────────── */

const LOGOS = [
  'WebElite', 'Novarte', 'ClimateTech', 'AgênciaForte', 'StudioNova',
  'BoldBrand', 'PixelShift', 'NexaWeb', 'Craftworks', 'SwiftSites',
  'WebElite', 'Novarte', 'ClimateTech', 'AgênciaForte', 'StudioNova',
  'BoldBrand', 'PixelShift', 'NexaWeb', 'Craftworks', 'SwiftSites',
];

const TESTIMONIALS = [
  {
    quote: "Vibbr built a complete landing page for my restaurant in under a minute. The SEO tags were already there. I didn't touch a line of code.",
    name: 'Maria Santos',
    role: 'Restaurant Owner',
  },
  {
    quote: "I use Vibbr for every client discovery call. I generate a site from their brief in front of them. They always say yes on the spot.",
    name: 'Ricardo Fonseca',
    role: 'Web Agency Owner',
  },
  {
    quote: "The edit feature is insane. I typed 'make it darker and add a WhatsApp button' and it just did it. My clients love the results.",
    name: 'Ana Pereira',
    role: 'Freelance Designer',
  },
];

const FAQS = [
  {
    q: 'Do I need to know how to code?',
    a: 'Not at all. Vibbr generates complete websites from plain English descriptions. Just describe your business and we handle everything else.',
  },
  {
    q: 'What does Vibbr actually generate?',
    a: 'Vibbr creates complete HTML, CSS and JavaScript files — real production code, not a page builder. You can download the files, host them anywhere, or use your vibbr.app subdomain.',
  },
  {
    q: 'Is SEO really included?',
    a: 'Yes, automatically. Every site includes meta tags, Open Graph, JSON-LD schema markup, a canonical URL, and a sitemap.xml — without you configuring anything.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. Free plan includes a yoursite.vibbr.app subdomain. Starter and Pro plans let you connect any custom domain with a simple CNAME record.',
  },
  {
    q: "How do I edit a site after it's generated?",
    a: "Type what you want changed in plain English — 'make the hero darker' or 'add a contact form' — and Vibbr updates the files and reloads the preview.",
  },
  {
    q: 'What happens if I run out of credits?',
    a: 'You can buy more anytime from your dashboard. Credit packs start at €7 for 10 credits. No subscription required.',
  },
];

/* ─── Feature mockup visuals ─────────────────────────────────────────────────── */

function TerminalMockup() {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm">
      <div className="h-24" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }} />
      <div className="bg-white p-6">
        <div className="rounded-lg p-4" style={{ background: '#0a0a0a', fontFamily: 'monospace', fontSize: 12 }}>
          <p className="text-green-400">✓ index.html</p>
          <p className="text-green-400 mt-1.5">✓ css/style.css</p>
          <p className="text-green-400 mt-1.5">✓ js/main.js</p>
          <p className="text-green-400 mt-1.5">✓ sitemap.xml</p>
          <p className="text-zinc-500 mt-2.5">→ Live at mysite.vibbr.app</p>
        </div>
      </div>
    </div>
  );
}

function SeoMockup() {
  const rows = ['Meta tags complete', 'Schema markup found', 'Open Graph tags set', 'Sitemap detected'];
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm">
      <div className="h-24" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }} />
      <div className="bg-white p-6">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-4xl font-bold text-green-600">94</span>
          <span className="text-sm text-zinc-400">SEO Score</span>
        </div>
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div key={row} className="flex justify-between items-center text-sm border-b border-zinc-50 pb-2 last:border-0 last:pb-0">
              <span className="text-zinc-700">{row}</span>
              <span className="text-green-500 font-bold">✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditMockup() {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm">
      <div className="h-24" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
      <div className="bg-white p-6">
        <p className="text-xs text-zinc-400 uppercase tracking-wider mb-3">Edit with AI</p>
        <div className="bg-zinc-50 rounded-lg p-3 text-sm text-zinc-700 mb-2">
          Make the hero section taller with a larger heading
        </div>
        <div className="bg-zinc-50 rounded-lg p-3 text-sm text-zinc-700 mb-3">
          Change the color scheme to dark green and white
        </div>
        <div className="bg-zinc-100 rounded-lg px-3 py-2 text-sm text-zinc-400">
          Add a WhatsApp button...
        </div>
      </div>
    </div>
  );
}

/* ─── Feature row ────────────────────────────────────────────────────────────── */

type Sub = [string, string];

interface FeatureRowProps {
  title: string;
  description: string;
  subs: Sub[];
  mockup: React.ReactNode;
  visualLeft: boolean;
}

function FeatureRow({ title, description, subs, mockup, visualLeft }: FeatureRowProps) {
  const text = (
    <div>
      <h3 className="text-2xl font-bold text-zinc-900 mb-3">{title}</h3>
      <p className="text-zinc-500 text-base leading-relaxed mb-6">{description}</p>
      <div>
        {subs.map(([t, d]) => (
          <div key={t} className="grid grid-cols-2 gap-4 border-b border-zinc-100 py-3 last:border-0">
            <span className="font-semibold text-zinc-900 text-sm">{t}</span>
            <span className="text-zinc-500 text-sm">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const visual = <div>{mockup}</div>;

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6 md:p-8 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {visualLeft ? <>{visual}{text}</> : <>{text}{visual}</>}
      </div>
    </div>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────────────────── */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6" style={{ background: '#fff' }}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16">
        <div className="md:w-1/3 shrink-0">
          <h2 className="text-4xl font-bold text-zinc-900 leading-tight">
            Frequently asked questions
          </h2>
        </div>
        <div className="flex-1">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-zinc-100 py-5">
              <button
                type="button"
                className="flex justify-between items-center w-full text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-zinc-900 font-medium text-base">{faq.q}</span>
                <span
                  className="text-zinc-400 text-xl ml-4 shrink-0 transition-transform duration-200"
                  style={{ display: 'inline-block', transform: openIndex === i ? 'rotate(45deg)' : 'none' }}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <p className="text-zinc-500 text-sm leading-relaxed mt-3">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */

export default function LandingHero() {
  const router = useRouter();

  function handleSend(prompt: string) {
    if (!prompt.trim()) return;
    localStorage.setItem('pendingPrompt', prompt.trim());
    router.push('/auth?mode=signup');
  }

  return (
    <>
      <style>{css}</style>

      {/* Fixed nav */}
      <nav
        className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 z-50 backdrop-blur-sm"
        style={{ background: 'rgba(10,10,15,0.75)' }}
      >
        <Link href="/">
          <VibbrLogoMark />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-white/70 hover:text-white text-sm transition-colors">Pricing</Link>
          <Link href="/blog" className="text-white/70 hover:text-white text-sm transition-colors">Blog</Link>
          <Link href="#" className="text-white/70 hover:text-white text-sm transition-colors">Docs</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/auth?mode=signin" className="text-white/70 hover:text-white text-sm px-4 py-2 transition-colors">
            Log in
          </Link>
          <Link
            href="/auth?mode=signup"
            className="bg-white text-black font-medium text-sm px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── SECTION 1: Hero (dark) ── */}
      <div style={{ background: '#0a0a0f', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', inset: 0,
            background: AURORA,
            animation: 'auroraShift 15s ease-in-out infinite alternate',
            pointerEvents: 'none',
          }}
        />
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-14">
          <p className="text-white/60 text-sm mb-4">Build something Vibbr</p>

          <h1 style={{
            fontSize: 'clamp(32px, 8vw, 96px)',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            maxWidth: 900,
            textAlign: 'center',
          }}>
            Build your website with AI
          </h1>

          <p className="text-white/60 text-xl max-w-xl mx-auto mt-4 mb-8">
            Create websites by describing what you want
          </p>

          <div className="max-w-2xl w-full mx-auto">
            <div style={{
              background: 'rgba(28,28,30,0.8)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              overflow: 'hidden',
            }}>
              <PromptInputBox
                onSend={handleSend}
                isLoading={false}
                placeholder="e.g. A landing page for my Muay Thai gym in Lisbon..."
              />
            </div>
          </div>
        </section>
      </div>

      {/* ── SECTION 2: Logos (white) ── */}
      <section className="py-16 border-t border-b border-zinc-100" style={{ background: '#fff' }}>
        <p className="text-center text-zinc-400 text-sm mb-8">Used by teams at</p>
        <div className="overflow-hidden">
          <div style={{ display: 'flex', alignItems: 'center', width: 'max-content', animation: 'slide 30s linear infinite' }}>
            {LOGOS.map((name, i) => (
              <span key={i} className="font-semibold text-zinc-800 text-xl mx-10 whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 + 4: Features (cream) ── */}
      <section style={{ background: '#FAF9F6' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-zinc-900 max-w-lg leading-tight mb-16">
            What businesses build with Vibbr
          </h2>

          <FeatureRow
            visualLeft
            title="AI generates your complete site"
            description="Describe your business in plain language. Vibbr writes clean HTML, CSS and JavaScript with real content, real structure, and SEO built in from the first line."
            subs={[
              ['Real content', 'No Lorem Ipsum — actual business copy'],
              ['Clean code', 'HTML, CSS, JS you can download and own'],
              ['Instant preview', 'See your site in seconds, not days'],
            ]}
            mockup={<TerminalMockup />}
          />

          <FeatureRow
            visualLeft={false}
            title="SEO built in from line one"
            description="Every site Vibbr generates includes meta tags, Open Graph, JSON-LD schema, canonical URLs and a sitemap. No plugins. No setup. Your clients rank on Google automatically."
            subs={[
              ['Meta tags', 'Title, description, OG tags on every page'],
              ['Schema markup', 'JSON-LD for LocalBusiness automatically'],
              ['Sitemap', 'XML sitemap generated and linked automatically'],
            ]}
            mockup={<SeoMockup />}
          />

          <FeatureRow
            visualLeft
            title="Edit with a follow-up prompt"
            description="Not happy with the hero section? Just say so. Type what you want changed and Vibbr edits the exact files. The preview reloads instantly. No code required."
            subs={[
              ['Natural language', 'Say what you want, not how to code it'],
              ['Targeted edits', 'Only the relevant files get updated'],
              ['Instant reload', 'Preview updates immediately after edits'],
            ]}
            mockup={<EditMockup />}
          />
        </div>
      </section>

      {/* ── SECTION 5: Testimonials (cream) ── */}
      <section style={{ background: '#FAF9F6' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-zinc-900 mb-12">What builders say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-zinc-100 rounded-2xl p-8">
                <p className="text-zinc-700 text-base leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-zinc-900 text-sm">{t.name}</p>
                  <p className="text-zinc-400 text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FAQ (white) ── */}
      <FAQSection />

      {/* ── SECTION 7: CTA (dark gradient) ── */}
      <section style={{ background: '#0a0a0f', position: 'relative', overflow: 'hidden' }} className="py-32 px-6 text-center">
        <div
          style={{
            position: 'absolute', inset: 0,
            background: AURORA,
            opacity: 0.75,
            animation: 'auroraShift 15s ease-in-out infinite alternate',
            pointerEvents: 'none',
          }}
        />
        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white mb-4">Dream it. Build it. Ship it.</h2>
          <p className="text-white/60 text-lg mb-8">Start free. No credit card needed.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth?mode=signup"
              className="bg-white text-black font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors"
            >
              Get started free
            </Link>
            <Link
              href="/pricing"
              className="border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer (white) ── */}
      <footer className="border-t border-zinc-100 py-10 px-6" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VibbrLogoMarkDark />
            <span className="text-zinc-400 text-xs ml-1">© 2025</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors">Privacy</Link>
            <Link href="#" className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors">Terms</Link>
            <Link href="/blog" className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors">Blog</Link>
            <Link href="/pricing" className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
