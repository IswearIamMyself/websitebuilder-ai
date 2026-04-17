import type { Metadata } from 'next';
import LandingHero from '@/components/ui/landing-hero';

export const metadata: Metadata = {
  title: 'Vibbr — Build your website with AI',
  description:
    'Create SEO-optimized websites by describing what you want. Vibbr generates complete HTML, CSS and JavaScript and deploys instantly.',
  keywords: ['AI website builder', 'website generator', 'SEO websites', 'Vibbr'],
  openGraph: {
    title: 'Vibbr — Build your website with AI',
    description: 'Create SEO-optimized websites by describing what you want.',
    url: 'https://vibbr.app',
    siteName: 'Vibbr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibbr — Build your website with AI',
    description: 'Create SEO-optimized websites by describing what you want.',
  },
};

export default function Page() {
  return <LandingHero />;
}
