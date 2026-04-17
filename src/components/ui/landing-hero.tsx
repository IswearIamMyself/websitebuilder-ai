'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SiteNav from '@/components/ui/site-nav';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
  * { font-family: 'Syne', sans-serif; }

  @keyframes float1 {
    0%,100% { transform: translate(0,0); }
    50%      { transform: translate(40px,30px); }
  }
  @keyframes float2 {
    0%,100% { transform: translate(0,0); }
    50%      { transform: translate(-30px,40px); }
  }
  @keyframes slideLeft {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes slideRight {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
  @keyframes termFade {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .term-line { opacity: 0; animation: termFade 0.4s ease forwards; }
  .term-1 { animation-delay: 0.3s; }
  .term-2 { animation-delay: 0.9s; }
  .term-3 { animation-delay: 1.5s; }
  .term-4 { animation-delay: 2.1s; }
  .term-5 { animation-delay: 2.8s; }
  .term-6 { animation-delay: 3.5s; }
`;

const ROW1 = [
  'WebElite','Novarte','SalCar','ClimateTech','AgênciaForte',
  'StudioNova','BrandLab','PixelAgency','WebElite','Novarte',
  'SalCar','ClimateTech','AgênciaForte','StudioNova',
];
const ROW2 = [
  'FlowAgency','CreativeHub','DigitalWave','MediaCraft','ProBuild',
  'NexaDesign','SwiftSites','BoldStudio','FlowAgency','CreativeHub',
  'DigitalWave','MediaCraft','ProBuild','NexaDesign',
];

/* ── Feature visuals ─────────────────────────────────────────────────────────── */

function TerminalCard() {
  return (
    <div className="w-full h-full bg-[#141414] border border-white/5 rounded-2xl p-6 font-mono text-xs flex flex-col gap-2">
      <p className="term-line term-1 text-green-400">✓ index.html generated</p>
      <p className="term-line term-2 text-green-400">✓ css/style.css generated</p>
      <p className="term-line term-3 text-green-400">✓ js/main.js generated</p>
      <p className="term-line term-4 text-green-400">✓ sitemap.xml generated</p>
      <p className="term-line term-5 text-zinc-500">→ Deploying to mysite.vibbr.app...</p>
      <p className="term-line term-6 text-green-400 font-semibold">✓ Live in 14 seconds</p>
    </div>
  );
}

function SeoCard() {
  const rows = ['Meta tags', 'Schema markup', 'Open Graph', 'Sitemap'];
  return (
    <div className="w-full h-full bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col justify-center gap-5">
      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-bold text-green-400">94</span>
        <span className="text-sm text-zinc-400">SEO Score</span>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
            <span className="text-xs text-zinc-300">{row}</span>
            <span className="text-green-400 text-xs font-semibold">✓</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DomainCard() {
  return (
    <div className="w-full h-full bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col justify-center gap-4">
      <div className="flex gap-2">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-zinc-300 font-mono">
          myclientsite.com
        </div>
        <button
          type="button"
          className="bg-orange-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg"
        >
          Connect
        </button>
      </div>
      <div>
        <p className="text-xs text-zinc-500 mb-2">Add this CNAME record:</p>
        <div className="bg-black rounded-lg p-3 font-mono text-xs text-zinc-300">
          * → sites.vibbr.app
        </div>
      </div>
      <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full px-3 py-1 w-fit">
        Domain verified ✓
      </div>
    </div>
  );
}

function EditCard() {
  return (
    <div className="w-full h-full bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Edit with AI</p>
      <div className="flex flex-col gap-2 flex-1">
        <div className="bg-zinc-800 rounded-lg p-2.5 text-xs text-zinc-400">
          Make the hero section taller
        </div>
        <div className="bg-zinc-800 rounded-lg p-2.5 text-xs text-zinc-400">
          Change font to something modern
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-zinc-600">
        Add a contact form...
      </div>
    </div>
  );
}

interface FeatureRowProps {
  reverse?: boolean;
  title: string;
  description: string;
  visual: React.ReactNode;
}

function FeatureRow({ reverse, title, description, visual }: FeatureRowProps) {
  return (
    <div className={`flex items-center gap-16 ${reverse ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>
      </div>
      <div className="flex-1 h-72 rounded-2xl overflow-hidden">
        {visual}
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────────── */

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

      {/* Mesh gradient background */}
      <div className="fixed inset-0 bg-[#0a0a0a]" style={{ zIndex: 0 }}>
        <div style={{
          position: 'absolute', width: 600, height: 600,
          top: -100, left: -200,
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float1 10s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500,
          bottom: '10%', right: -150,
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float2 13s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          top: '30%', right: '20%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float1 8s ease-in-out 2s infinite',
          pointerEvents: 'none',
        }} />
      </div>

      <SiteNav />

      {/* ── Hero ── */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-14 px-6 relative z-10 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 mb-8">
          Now with SEO built in — every site, automatically
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(52px, 7vw, 88px)',
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          color: 'white',
          maxWidth: 900,
          textAlign: 'center',
        }}>
          Build websites{' '}
          <span style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            that actually rank
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-zinc-400 text-lg max-w-lg mx-auto mt-6 mb-10 leading-relaxed">
          Describe your business. Vibbr generates a complete,
          SEO-optimized website and deploys it instantly.
          No code. No design skills. No waiting.
        </p>

        {/* Prompt box */}
        <div
          className="max-w-2xl w-full mx-auto"
          style={{
            boxShadow: '0 0 80px rgba(139,92,246,0.12), 0 0 40px rgba(236,72,153,0.08)',
            borderRadius: 16,
          }}
        >
          <PromptInputBox
            onSend={handleSend}
            isLoading={false}
            placeholder="e.g. A landing page for my Muay Thai gym in Lisbon..."
          />
        </div>

        {/* Social proof */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-zinc-600">
          <span>2,400+ sites built</span>
          <span>·</span>
          <span>Average 18s generation</span>
          <span>·</span>
          <span>SEO score 94/100</span>
        </div>
      </section>

      {/* ── Sliding logos ── */}
      <section className="py-16 border-t border-white/5 relative z-10">
        <p className="text-center text-xs text-zinc-600 uppercase tracking-widest mb-8">
          Trusted by teams at
        </p>
        <div className="overflow-hidden mb-4">
          <div style={{ display: 'flex', width: 'max-content', animation: 'slideLeft 25s linear infinite' }}>
            {ROW1.map((name, i) => (
              <span key={i} className="font-semibold text-zinc-700 text-lg mx-8 whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div style={{ display: 'flex', width: 'max-content', animation: 'slideRight 30s linear infinite' }}>
            {ROW2.map((name, i) => (
              <span key={i} className="font-semibold text-zinc-700 text-lg mx-8 whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <p className="text-xs text-zinc-600 uppercase tracking-widest text-center mb-4">
          What you actually get
        </p>
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Everything included.
        </h2>
        <div className="flex flex-col gap-24">
          <FeatureRow
            title="Claude generates your entire site"
            description="Type what your business does. Claude writes clean HTML, CSS and JavaScript — with real content, not Lorem Ipsum. Every file is yours to download."
            visual={<TerminalCard />}
          />
          <FeatureRow
            reverse
            title="SEO baked in from line one"
            description="Every site gets meta tags, Open Graph, JSON-LD schema, canonical URLs and a sitemap automatically. No plugins. No setup. Your clients rank without lifting a finger."
            visual={<SeoCard />}
          />
          <FeatureRow
            title="Your client connects their domain"
            description="Free subdomain on vibbr.app included. When they're ready, one CNAME record connects their custom domain. SSL automatic. Takes two minutes."
            visual={<DomainCard />}
          />
          <FeatureRow
            reverse
            title="Edit with a follow-up prompt"
            description="Not happy with the hero? Just say so. 'Make the header darker' or 'Add a WhatsApp button' — Vibbr edits the exact files and reloads the preview instantly."
            visual={<EditCard />}
          />
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-32 px-6 text-center relative z-10">
        <h2 className="text-5xl font-bold text-white mb-4">Start building today</h2>
        <p className="text-zinc-400 mb-8">Free to try. No credit card. One generation on us.</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/auth?mode=signup"
            className="bg-white text-black font-semibold px-8 py-3 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            Get started free
          </Link>
          <Link
            href="/pricing"
            className="border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            See pricing
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/vibbr-icon.png" alt="Vibbr" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-semibold text-white text-base">Vibbr</span>
            <span className="text-zinc-600 text-xs ml-2">© 2025</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
            <Link href="/blog" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Blog</Link>
            <Link href="/pricing" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
