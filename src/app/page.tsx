import type { Metadata } from 'next';
import LandingHero from '@/components/ui/landing-hero';

export const metadata: Metadata = {
  title: 'Vibbr — AI Website Builder',
  description:
    'Describe your website and Vibbr builds it with AI. SEO-optimized, deployed instantly. Used by 2,400+ business owners and agencies.',
  keywords: ['AI website builder', 'website generator', 'SEO websites', 'Vibbr'],
  openGraph: {
    title: 'Vibbr — AI Website Builder',
    description: 'Build SEO-optimized websites with AI in seconds.',
    url: 'https://vibbr.app',
    siteName: 'Vibbr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibbr — AI Website Builder',
    description: 'Build SEO-optimized websites with AI in seconds.',
  },
};

export default function Page() {
  return <LandingHero />;
}
