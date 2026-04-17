'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';

interface Site {
  id: string;
  name: string;
  subdomain: string;
}

const CHIPS = [
  'Landing page for a Muay Thai gym',
  'Portfolio for a freelance designer',
  'Restaurant with online menu',
  'Agency site with case studies',
];

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoSubmitFiredRef = useRef(false);

  useEffect(() => {
    async function fetchSites() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('sites')
        .select('id, name, subdomain')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setSites(data as Site[]);
      setLoading(false);
    }
    fetchSites();
  }, []);

  // Auto-submit prompt from URL param (set by landing page → auth flow)
  useEffect(() => {
    if (loading) return;
    if (autoSubmitFiredRef.current) return;
    const prompt = searchParams.get('prompt');
    if (!prompt) return;
    autoSubmitFiredRef.current = true;
    const timer = setTimeout(() => handleSend(prompt), 500);
    return () => clearTimeout(timer);
  }, [loading, searchParams]);

  async function handleSend(message: string) {
    if (!message.trim()) return;
    setError(null);
    setGenerating(true);
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
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Full-screen generating overlay */}
      {generating && (
        <div className="fixed inset-0 flex items-center justify-center z-50 flex-col gap-4" style={{ background: 'rgba(15,15,15,0.95)' }}>
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-medium">Generating your site...</p>
        </div>
      )}

      {sites.length === 0 ? (
        /* ── No sites ── */
        <div className="flex flex-col items-center justify-center h-[80vh] px-4">
          <h1 className="text-4xl font-bold text-white text-center">
            What are we building today?
          </h1>
          <p className="mt-3 text-zinc-400 text-center">
            Describe your site — we&apos;ll write every line of code.
          </p>

          <div className="w-full max-w-2xl mt-8">
            <PromptInputBox
              onSend={handleSend}
              isLoading={generating}
              placeholder="Describe the site you want to build..."
            />
            {error && (
              <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
            )}
          </div>

          {/* Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSend(chip)}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm text-zinc-300 cursor-pointer border border-white/8 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Has sites ── */
        <div className="px-6 py-6">
          <div className="max-w-xl mx-auto mb-8">
            <PromptInputBox
              onSend={handleSend}
              isLoading={generating}
              placeholder="Build something new..."
            />
            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}
          </div>

          <h2 className="text-lg font-semibold text-white mb-4">Your sites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sites.map((site) => (
              <div
                key={site.id}
                className="border border-white/8 rounded-xl p-5 flex flex-col"
                style={{ background: '#141414' }}
              >
                <p className="font-bold text-white">{site.name}</p>
                <p className="text-zinc-500 text-sm mt-1">{site.subdomain}.vibbr.app</p>
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/dashboard/${site.id}`}
                    className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Open →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
