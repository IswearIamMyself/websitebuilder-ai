'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { VibbrLogoHorizontal } from '@/components/ui/vibbr-logo';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');`;

export default function LandingPage() {
  const router = useRouter();

  function handleSend(prompt: string) {
    if (!prompt.trim()) return;
    localStorage.setItem('pendingPrompt', prompt.trim());
    router.push('/auth?mode=signup');
  }

  return (
    <>
      <style>{fontImport}</style>
      <style>{`* { font-family: 'Syne', sans-serif; }`}</style>

      <div className="min-h-screen flex flex-col" style={{ background: '#0f0f0f' }}>
        {/* Nav */}
        <header className="flex items-center justify-between px-6 py-4">
          <Link href="/">
            <VibbrLogoHorizontal />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth?mode=signin"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/auth?mode=signup"
              className="text-sm font-semibold text-white bg-orange-500 hover:bg-orange-400 transition-colors px-4 py-1.5 rounded-lg"
            >
              Get started
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-3xl">
            Build your website<br />with AI
          </h1>
          <p className="mt-5 text-lg text-zinc-400 max-w-md">
            Describe it. We build it. Live in seconds.
          </p>

          <div className="w-full max-w-2xl mt-10">
            <PromptInputBox
              onSend={handleSend}
              isLoading={false}
              placeholder="Describe the site you want to build..."
            />
          </div>
        </main>
      </div>
    </>
  );
}
