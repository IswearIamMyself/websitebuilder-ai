'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  onSelect?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-orange-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PricingCard({
  title, price, period, description, features, cta,
  highlight, onSelect, loading, disabled,
}: PricingCardProps) {
  return (
    <div className={[
      'relative flex flex-col rounded-2xl p-6 border transition-colors',
      highlight
        ? 'bg-zinc-900 border-orange-500 shadow-xl shadow-orange-900/20'
        : 'bg-zinc-900 border-zinc-800',
    ].join(' ')}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
            Most popular
          </span>
        </div>
      )}

      <h3 className="text-white font-bold text-lg">{title}</h3>
      <p className="text-zinc-400 text-sm mt-1">{description}</p>

      <div className="mt-4 mb-6">
        <span className="text-white text-4xl font-bold">{price}</span>
        {period && <span className="text-zinc-400 text-sm ml-1">{period}</span>}
      </div>

      <ul className="space-y-2.5 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
            <CheckIcon />
            {f}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        disabled={disabled || loading}
        className={[
          'mt-6 w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          highlight
            ? 'bg-orange-500 hover:bg-orange-400 text-white'
            : onSelect
            ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
            : 'bg-zinc-800 text-zinc-500 cursor-default',
        ].join(' ')}
      >
        {loading ? 'Redirecting...' : cta}
      </button>
    </div>
  );
}

type LoadingState = 'starter' | 'pro' | 10 | 30 | 70 | null;

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<LoadingState>(null);

  async function handlePlan(plan: 'starter' | 'pro') {
    setLoading(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) router.push(data.url);
    } catch {
      setLoading(null);
    }
  }

  async function handleCredits(credits: 10 | 30 | 70) {
    setLoading(credits);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) router.push(data.url);
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Simple, transparent pricing</h1>
          <p className="mt-3 text-zinc-400">Start free. Upgrade when you need more power.</p>
        </div>

        {/* ── Plan cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard
            title="Free"
            price="€0"
            description="Try it out"
            features={[
              '1 generation',
              'Subdomain hosting',
              'Basic SEO',
              'Community support',
            ]}
            cta="Current plan"
            disabled
          />

          <PricingCard
            title="Starter"
            price="€29"
            period="/mo"
            description="For individuals"
            highlight
            features={[
              '30 credits/month',
              'Custom domain',
              'Full SEO suite',
              'OG tags & JSON-LD',
              'Priority support',
            ]}
            cta="Get started"
            onSelect={() => handlePlan('starter')}
            loading={loading === 'starter'}
          />

          <PricingCard
            title="Pro"
            price="€79"
            period="/mo"
            description="For teams & agencies"
            features={[
              '100 credits/month',
              'Everything in Starter',
              'Priority generation',
              'Multiple sites',
              'Dedicated support',
            ]}
            cta="Get started"
            onSelect={() => handlePlan('pro')}
            loading={loading === 'pro'}
          />
        </div>

        {/* ── Credit packs ── */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Need more credits?</h2>
          <p className="text-zinc-400 text-center mb-8">One-time top-ups, no subscription needed.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {([
              { amount: 10 as const, price: '€7', label: '10 credits' },
              { amount: 30 as const, price: '€18', label: '30 credits' },
              { amount: 70 as const, price: '€35', label: '70 credits' },
            ] as const).map(({ amount, price, label }) => (
              <div key={amount} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center gap-3">
                <p className="text-white font-bold text-xl">{price}</p>
                <p className="text-zinc-400 text-sm">{label}</p>
                <button
                  type="button"
                  onClick={() => handleCredits(amount)}
                  disabled={loading === amount}
                  className="w-full py-2 px-4 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm font-medium text-white transition-colors disabled:opacity-50"
                >
                  {loading === amount ? 'Redirecting...' : 'Buy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
