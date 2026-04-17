import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/ui/site-nav';
import FAQAccordion from '@/components/ui/faq-accordion';
import CheckoutButton from '@/components/ui/checkout-button';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for Vibbr. Start free, upgrade when ready. No hidden fees.',
};

/* ─── Feature list ───────────────────────────────────────────────────────────── */

function FeatureList({ items }: { items: { text: string; included: boolean }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.text} className="flex items-center gap-3">
          <span className={`text-sm font-semibold shrink-0 ${item.included ? 'text-green-500' : 'text-zinc-300'}`}>
            {item.included ? '✓' : '✗'}
          </span>
          <span className={`text-sm ${item.included ? 'text-zinc-600' : 'text-zinc-300'}`}>
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <div style={{ background: '#ffffff' }}>
      <SiteNav />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 text-center px-6 bg-white">
        <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
          Simple, transparent pricing
        </p>
        <h1 className="text-5xl font-bold text-zinc-900 mb-4 leading-tight">
          Pay for what you use
        </h1>
        <p className="text-zinc-400 text-lg">
          Start free. Upgrade when you&apos;re ready. No hidden fees.
        </p>
      </section>

      {/* ── Pricing cards ── */}
      <section className="py-16 px-6" style={{ background: '#FAF9F6' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Free */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-8">
            <p className="font-bold text-zinc-900 text-xl mb-1">Free</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-zinc-900">€0</span>
              <span className="text-zinc-400 text-base">/month</span>
            </div>
            <p className="text-zinc-500 text-sm mt-2 mb-6">Try it out. One generation on us.</p>
            <Link
              href="/auth?mode=signup"
              className="block w-full py-3 rounded-xl text-sm font-medium text-center border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors mb-6"
            >
              Get started free
            </Link>
            <div className="border-t border-zinc-100 mb-6" />
            <FeatureList items={[
              { text: '1 site generation', included: true },
              { text: 'vibbr.app subdomain', included: true },
              { text: 'SEO tags included', included: true },
              { text: 'Download your files', included: true },
              { text: 'Custom domain', included: false },
              { text: 'Unlimited sites', included: false },
              { text: 'Priority generation', included: false },
            ]} />
          </div>

          {/* Starter (highlighted) */}
          <div className="flex flex-col items-start">
            <span className="bg-zinc-900 text-white text-xs px-3 py-1 rounded-full mb-3 inline-block">
              Most popular
            </span>
            <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 w-full">
              <p className="font-bold text-zinc-900 text-xl mb-1">Starter</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-zinc-900">€29</span>
                <span className="text-zinc-400 text-base">/month</span>
              </div>
              <p className="text-zinc-500 text-sm mt-2 mb-6">For business owners building their presence.</p>
              <CheckoutButton
                plan="starter"
                className="w-full py-3 rounded-xl text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors mb-6 disabled:opacity-60"
              >
                Get started
              </CheckoutButton>
              <div className="border-t border-zinc-100 mb-6" />
              <FeatureList items={[
                { text: '30 credits/month', included: true },
                { text: 'Unlimited sites', included: true },
                { text: 'Custom domain', included: true },
                { text: 'Full SEO suite', included: true },
                { text: 'Download your files', included: true },
                { text: 'Edit with AI', included: true },
                { text: 'Priority generation', included: false },
              ]} />
            </div>
          </div>

          {/* Pro */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-8">
            <p className="font-bold text-zinc-900 text-xl mb-1">Pro</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-zinc-900">€79</span>
              <span className="text-zinc-400 text-base">/month</span>
            </div>
            <p className="text-zinc-500 text-sm mt-2 mb-6">For agencies building for clients.</p>
            <CheckoutButton
              plan="pro"
              className="w-full py-3 rounded-xl text-sm font-medium border border-zinc-900 text-zinc-900 hover:bg-zinc-50 transition-colors mb-6 disabled:opacity-60"
            >
              Get started
            </CheckoutButton>
            <div className="border-t border-zinc-100 mb-6" />
            <FeatureList items={[
              { text: '100 credits/month', included: true },
              { text: 'Unlimited sites', included: true },
              { text: 'Custom domain', included: true },
              { text: 'Full SEO suite', included: true },
              { text: 'Download your files', included: true },
              { text: 'Edit with AI', included: true },
              { text: 'Priority generation', included: true },
            ]} />
          </div>
        </div>
      </section>

      {/* ── Credit packs ── */}
      <section className="py-16 px-6 bg-white border-t border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 text-center mb-3">
            Need more credits?
          </h2>
          <p className="text-zinc-400 text-center mb-10">
            Buy once, use anytime. Credits never expire.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Pack 10 */}
            <div className="rounded-2xl p-6 text-center border border-zinc-100" style={{ background: '#FAF9F6' }}>
              <p className="text-xl font-bold text-zinc-900 mt-2">10 credits</p>
              <p className="text-3xl font-bold text-zinc-900 mt-2">€7</p>
              <p className="text-zinc-400 text-sm mt-1">€0.70 per credit</p>
              <CheckoutButton
                credits={10}
                className="mt-6 border border-zinc-200 text-zinc-700 px-6 py-2 rounded-xl text-sm hover:bg-white transition-colors disabled:opacity-60"
              >
                Buy pack
              </CheckoutButton>
            </div>

            {/* Pack 30 */}
            <div className="rounded-2xl p-6 text-center border border-zinc-100" style={{ background: '#FAF9F6' }}>
              <p className="text-xl font-bold text-zinc-900 mt-2">30 credits</p>
              <p className="text-3xl font-bold text-zinc-900 mt-2">€18</p>
              <p className="text-zinc-400 text-sm mt-1">€0.60 per credit</p>
              <CheckoutButton
                credits={30}
                className="mt-6 border border-zinc-200 text-zinc-700 px-6 py-2 rounded-xl text-sm hover:bg-white transition-colors disabled:opacity-60"
              >
                Buy pack
              </CheckoutButton>
            </div>

            {/* Pack 70 */}
            <div className="rounded-2xl p-6 text-center border border-zinc-100" style={{ background: '#FAF9F6' }}>
              <div className="flex items-center justify-center mt-2 gap-2">
                <p className="text-xl font-bold text-zinc-900">70 credits</p>
                <span className="bg-zinc-900 text-white text-xs px-2 py-0.5 rounded-full">Best value</span>
              </div>
              <p className="text-3xl font-bold text-zinc-900 mt-2">€35</p>
              <p className="text-zinc-400 text-sm mt-1">€0.50 per credit</p>
              <CheckoutButton
                credits={70}
                className="mt-6 border border-zinc-200 text-zinc-700 px-6 py-2 rounded-xl text-sm hover:bg-white transition-colors disabled:opacity-60"
              >
                Buy pack
              </CheckoutButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6" style={{ background: '#FAF9F6' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-zinc-900 text-center mb-12">
            Common questions
          </h2>
          <FAQAccordion />
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-6 pb-16 pt-8" style={{ background: '#FAF9F6' }}>
        <div className="bg-zinc-900 py-20 px-6 text-center rounded-3xl max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-3">Start building today</h2>
          <p className="text-white/60 mb-8">Free plan available. No credit card required.</p>
          <Link
            href="/auth?mode=signup"
            className="inline-block bg-white text-zinc-900 font-semibold px-8 py-3 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            Get started free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-100 py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
    </div>
  );
}
