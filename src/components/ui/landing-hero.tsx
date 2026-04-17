'use client';

import { useRouter } from 'next/navigation';
import SiteNav from '@/components/ui/site-nav';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
  * { font-family: 'Syne', sans-serif; }

  @keyframes float1 {
    0%,100% { transform: translate(0,0); }
    50%      { transform: translate(30px,20px); }
  }
  @keyframes float2 {
    0%,100% { transform: translate(0,0); }
    50%      { transform: translate(-20px,30px); }
  }
  @keyframes float3 {
    0%,100% { transform: translate(0,0); }
    50%      { transform: translate(20px,-20px); }
  }
  @keyframes floatCard {
    0%,100% { transform: translateY(0px) rotate(-1deg); }
    50%      { transform: translateY(-12px) rotate(1deg); }
  }
`;

const ORB1: React.CSSProperties = {
  position: 'absolute',
  width: 600, height: 600,
  top: -100, left: -100,
  background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
  filter: 'blur(80px)',
  animation: 'float1 10s ease-in-out infinite',
  pointerEvents: 'none',
};

const ORB2: React.CSSProperties = {
  position: 'absolute',
  width: 500, height: 500,
  bottom: -100, right: -100,
  background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
  filter: 'blur(80px)',
  animation: 'float2 12s ease-in-out infinite',
  pointerEvents: 'none',
};

const ORB3: React.CSSProperties = {
  position: 'absolute',
  width: 400, height: 400,
  top: 100, right: 0,
  background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)',
  filter: 'blur(80px)',
  animation: 'float3 8s ease-in-out infinite',
  pointerEvents: 'none',
};

function FloatingCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="hidden lg:block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-xs text-zinc-400"
      style={{ position: 'absolute', pointerEvents: 'none', zIndex: 0, ...style }}
    >
      {children}
    </div>
  );
}

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
      <div className="fixed inset-0" style={{ background: '#0f0f12', zIndex: 0 }}>
        <div style={ORB1} />
        <div style={ORB2} />
        <div style={ORB3} />
      </div>

      <SiteNav />

      {/* Hero */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-14 px-4">

        {/* Floating cards */}
        <FloatingCard style={{ top: '20%', left: '5%', animation: 'floatCard 6s ease-in-out infinite', animationDelay: '0s' }}>
          ⚡ Landing page generated in 12s
        </FloatingCard>
        <FloatingCard style={{ top: '20%', right: '5%', animation: 'floatCard 6s ease-in-out infinite', animationDelay: '1.5s' }}>
          🎯 SEO score: 98/100
        </FloatingCard>
        <FloatingCard style={{ bottom: '25%', left: '5%', animation: 'floatCard 6s ease-in-out infinite', animationDelay: '3s' }}>
          🌍 Custom domain connected
        </FloatingCard>
        <FloatingCard style={{ bottom: '25%', right: '5%', animation: 'floatCard 6s ease-in-out infinite', animationDelay: '4.5s' }}>
          ✓ 847 sites built today
        </FloatingCard>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 mb-6">
            ✦ AI-powered website builder
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: 'white',
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            Build your website{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              with AI
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-center text-zinc-400 text-lg max-w-md mx-auto mt-4 mb-8">
            Describe it. We build it. Deployed and SEO-ready in seconds.
          </p>

          {/* Prompt box with glow */}
          <div
            className="w-full"
            style={{
              maxWidth: 672,
              boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 0 120px rgba(236,72,153,0.1)',
              borderRadius: 16,
            }}
          >
            <PromptInputBox
              onSend={handleSend}
              isLoading={false}
              placeholder="Describe the site you want to build..."
            />
          </div>

          {/* Social proof */}
          <p className="mt-6 text-xs text-zinc-500">
            Trusted by 2,400+ builders · No credit card required
          </p>
        </div>
      </main>
    </>
  );
}
