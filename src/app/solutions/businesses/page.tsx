import type { Metadata } from 'next';
import SolutionPage, { type SolutionData } from '@/components/ui/solution-page';

export const metadata: Metadata = {
  title: 'Vibbr for Businesses',
  description: 'Get your business online without a developer. Professional website with SEO in under a minute.',
};

const data: SolutionData = {
  label: 'Vibbr for businesses',
  heading: 'Your business online. No developer needed.',
  subtext: 'Describe your business and get a professional website with SEO, contact forms, and your domain — in under a minute.',
  sectionHeader: 'What businesses build with Vibbr',
  heroBackground: 'linear-gradient(160deg, #0a1628 0%, #0d2137 20%, #0e4d5c 40%, #0f6b50 65%, #1a8a3a 100%)',
  features: [
    {
      gradient: 'linear-gradient(135deg, #f97316, #fbbf24)',
      title: 'Just describe your business',
      description: "Tell Vibbr what you do, where you are, and who your customers are. We write the copy, design the layout, and build the code. You just describe it.",
      subs: [
        { title: 'Plain English', desc: 'No technical knowledge needed' },
        { title: 'Real content', desc: 'Your business, your words, AI-written' },
        { title: 'Live in seconds', desc: 'From description to live site instantly' },
      ],
      mockup: 'terminal',
      visualLeft: true,
    },
    {
      gradient: 'linear-gradient(135deg, #10b981, #3b82f6)',
      title: 'Rank on Google from day one',
      description: "Every Vibbr site includes everything Google needs to find you — meta tags, business schema, sitemap and more. No SEO agency required.",
      subs: [
        { title: 'Local SEO', desc: 'LocalBusiness schema for every site' },
        { title: 'Mobile-first', desc: 'Fully responsive on all devices' },
        { title: 'Fast loading', desc: 'Clean code means fast load times' },
      ],
      mockup: 'seo',
      visualLeft: false,
    },
    {
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      title: 'Your domain, your brand',
      description: "Connect your own domain in minutes. Your site lives at yourbusiness.com — not some template platform subdomain. Professional from day one.",
      subs: [
        { title: 'Custom domain', desc: 'Connect any domain you own' },
        { title: 'Free subdomain', desc: 'yoursite.vibbr.app while you decide' },
        { title: 'SSL included', desc: 'Secure by default, no setup needed' },
      ],
      mockup: 'domain',
      visualLeft: true,
    },
  ],
  testimonial: {
    quote: 'I described my restaurant in two sentences and got a complete website with our menu, location and opening hours. Took 45 seconds.',
    name: 'Maria Santos',
    role: 'Tasca do Porto',
  },
};

export default function Page() {
  return <SolutionPage data={data} />;
}
