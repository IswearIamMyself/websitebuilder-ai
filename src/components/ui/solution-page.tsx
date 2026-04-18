/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import SiteNav from '@/components/ui/site-nav';

/* ─── Types ──────────────────────────────────────────────────────────────────── */

export type MockupType = 'terminal' | 'seo' | 'edit' | 'domain';

export interface SolutionSub {
  title: string;
  desc: string;
}

export interface SolutionFeature {
  gradient: string;
  title: string;
  description: string;
  subs: SolutionSub[];
  mockup: MockupType;
  visualLeft: boolean;
}

export interface SolutionData {
  label: string;
  heading: string;
  subtext: string;
  sectionHeader: string;
  features: SolutionFeature[];
  testimonial: {
    quote: string;
    name: string;
    role: string;
  };
}

/* ─── Constants ──────────────────────────────────────────────────────────────── */

const AURORA = [
  'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(99,60,180,0.8) 0%, transparent 60%)',
  'radial-gradient(ellipse 60% 80% at 70% 60%, rgba(219,39,119,0.7) 0%, transparent 55%)',
  'radial-gradient(ellipse 50% 50% at 50% 80%, rgba(249,115,22,0.5) 0%, transparent 60%)',
  '#0a0a0f',
].join(', ');

const LOGOS = [
  'WebElite', 'Novarte', 'ClimateTech', 'AgênciaForte', 'StudioNova',
  'BoldBrand', 'PixelShift', 'NexaWeb', 'Craftworks', 'SwiftSites',
  'WebElite', 'Novarte', 'ClimateTech', 'AgênciaForte', 'StudioNova',
  'BoldBrand', 'PixelShift', 'NexaWeb', 'Craftworks', 'SwiftSites',
];

const css = `
  @keyframes slide {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes auroraShift {
    0%   { transform: scale(1) translate(0, 0); }
    50%  { transform: scale(1.06) translate(1.5%, -1%); }
    100% { transform: scale(1) translate(0, 0); }
  }
`;

/* ─── Mockup components ──────────────────────────────────────────────────────── */

function TerminalMockup({ gradient }: { gradient: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm">
      <div className="h-24" style={{ background: gradient }} />
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

function SeoMockup({ gradient }: { gradient: string }) {
  const rows = ['Meta tags complete', 'Schema markup found', 'Open Graph tags set', 'Sitemap detected'];
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm">
      <div className="h-24" style={{ background: gradient }} />
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

function EditMockup({ gradient }: { gradient: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm">
      <div className="h-24" style={{ background: gradient }} />
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

function DomainMockup({ gradient }: { gradient: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm">
      <div className="h-24" style={{ background: gradient }} />
      <div className="bg-white p-6 flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-xs text-zinc-600 font-mono">
            myclientsite.com
          </div>
          <button type="button" className="bg-orange-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg">
            Connect
          </button>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-2">Add this CNAME record:</p>
          <div className="bg-zinc-50 rounded-lg p-3 font-mono text-xs text-zinc-600">
            * → sites.vibbr.app
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-600 text-xs rounded-full px-3 py-1 w-fit">
          Domain verified ✓
        </div>
      </div>
    </div>
  );
}

function renderMockup(type: MockupType, gradient: string) {
  if (type === 'seo') return <SeoMockup gradient={gradient} />;
  if (type === 'edit') return <EditMockup gradient={gradient} />;
  if (type === 'domain') return <DomainMockup gradient={gradient} />;
  return <TerminalMockup gradient={gradient} />;
}

/* ─── Page template ──────────────────────────────────────────────────────────── */

export default function SolutionPage({ data }: { data: SolutionData }) {
  return (
    <>
      <style>{css}</style>

      <SiteNav />

      {/* ── Hero ── */}
      <div style={{ background: '#0a0a0f', position: 'relative', overflow: 'hidden', minHeight: '70vh' }}>
        <div
          style={{
            position: 'absolute', inset: 0,
            background: AURORA,
            animation: 'auroraShift 15s ease-in-out infinite alternate',
            pointerEvents: 'none',
          }}
        />
        <section
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-14"
          style={{ minHeight: '70vh' }}
        >
          <p className="text-white/50 text-sm uppercase tracking-widest mb-4">{data.label}</p>
          <h1
            style={{
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              maxWidth: 768,
              textAlign: 'center',
            }}
          >
            {data.heading}
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto text-center mt-4">
            {data.subtext}
          </p>
          <Link
            href="/auth?mode=signup"
            className="bg-white text-zinc-900 font-semibold px-8 py-4 rounded-xl hover:bg-zinc-100 transition-colors mt-8 inline-block"
          >
            Get started free
          </Link>
        </section>
      </div>

      {/* ── Logos ── */}
      <section className="py-16 border-t border-b border-zinc-100 bg-white overflow-hidden">
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

      {/* ── Features ── */}
      <section style={{ background: '#FAF9F6' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-zinc-900 max-w-lg leading-tight mb-16">
            {data.sectionHeader}
          </h2>

          {data.features.map((feature, i) => {
            const text = (
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                <p className="text-zinc-500 text-base leading-relaxed mb-6">{feature.description}</p>
                <div>
                  {feature.subs.map((sub) => (
                    <div key={sub.title} className="grid grid-cols-2 gap-4 border-b border-zinc-100 py-3 last:border-0">
                      <span className="font-semibold text-zinc-900 text-sm">{sub.title}</span>
                      <span className="text-zinc-500 text-sm">{sub.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
            const visual = <div>{renderMockup(feature.mockup, feature.gradient)}</div>;

            return (
              <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-8 mb-6">
                <div className="grid grid-cols-2 gap-12 items-center">
                  {feature.visualLeft ? <>{visual}{text}</> : <>{text}{visual}</>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section style={{ background: '#FAF9F6' }} className="py-24 px-6 border-t border-zinc-100">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl text-zinc-700 font-medium leading-relaxed italic mb-6">
            &ldquo;{data.testimonial.quote}&rdquo;
          </blockquote>
          <p className="font-semibold text-zinc-900 text-sm">{data.testimonial.name}</p>
          <p className="text-zinc-400 text-sm mt-1">{data.testimonial.role}</p>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
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

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-100 py-10 px-6" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/vibbr-icon.png" alt="Vibbr" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-semibold text-zinc-900">Vibbr</span>
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
