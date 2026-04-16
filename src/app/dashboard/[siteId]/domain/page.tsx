'use client';

import { use, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Site {
  id: string;
  name: string;
  subdomain: string;
  custom_domain: string | null;
}

export default function DomainPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = use(params);
  const supabase = createClient();

  const [site, setSite] = useState<Site | null>(null);
  const [domain, setDomain] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('sites')
        .select('id, name, subdomain, custom_domain')
        .eq('id', siteId)
        .single();
      if (data) {
        const s = data as Site;
        setSite(s);
        if (s.custom_domain) setDomain(s.custom_domain);
      }
    }
    load();
  }, [siteId]);

  // Poll DNS verification whenever a domain is saved
  useEffect(() => {
    if (!saveSuccess || !domain) return;

    async function checkVerification() {
      const res = await fetch(`/api/verify-domain?domain=${encodeURIComponent(domain)}`);
      const data = await res.json() as { verified: boolean };
      setVerified(data.verified);
      if (data.verified && pollRef.current) {
        clearInterval(pollRef.current);
      }
    }

    checkVerification();
    pollRef.current = setInterval(checkVerification, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [saveSuccess, domain]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/domain`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed to save domain');
      setSaveSuccess(true);
      setVerified(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-1">Custom Domain</h1>
      {site && (
        <p className="text-zinc-400 text-sm mb-8">
          Configure a custom domain for <span className="text-zinc-200">{site.name}</span>.
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="flex gap-3 mb-6">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="www.yourdomain.com"
          className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors"
        />
        <button
          type="submit"
          disabled={saving || !domain.trim()}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>

      {saveError && (
        <p className="text-sm text-red-400 mb-4">{saveError}</p>
      )}

      {/* DNS instructions */}
      {site && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-sm font-medium text-white mb-3">
            Add this CNAME record to your DNS provider:
          </p>
          <div className="bg-zinc-800 rounded-lg p-3 font-mono text-sm flex items-center justify-between gap-4">
            <span className="text-zinc-400">
              <span className="text-zinc-200">{domain || 'www.yourdomain.com'}</span>
              {' → '}
              <span className="text-orange-400">sites.vibbr.app</span>
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            DNS propagation can take up to 48 hours.
          </p>

          {/* Verification badge */}
          {saveSuccess && verified !== null && (
            <div className="mt-4 flex items-center gap-2">
              {verified ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  Pending
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
