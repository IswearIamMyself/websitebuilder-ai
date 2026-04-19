import type { Metadata } from 'next';
import SolutionPage, { type SolutionData } from '@/components/ui/solution-page';

export const metadata: Metadata = {
  title: 'Vibbr for Founders',
  description: 'Launch a professional landing page for your startup in 60 seconds. Collect emails, test messaging, validate demand.',
};

const data: SolutionData = {
  label: 'Vibbr for founders',
  heading: 'Validate your idea before you build it',
  subtext: 'Launch a professional landing page for your startup in 60 seconds. Collect emails, test your messaging, and validate demand — before writing a single line of backend code.',
  sectionHeader: 'What founders build with Vibbr',
  heroBackground: 'linear-gradient(160deg, #020514 0%, #0d1b4e 20%, #1a2d8a 38%, #2d4fcc 56%, #7c3aed 78%, #a855f7 100%)',
  features: [
    {
      gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)',
      title: 'Ship your landing page today',
      description: 'Stop waiting to build the perfect product before telling the world. Describe your startup idea and get a professional landing page live in under a minute. Start collecting emails while you build.',
      subs: [
        { title: 'Instant MVP page', desc: 'From idea to live page in 60 seconds' },
        { title: 'Email capture', desc: 'Contact forms built in automatically' },
        { title: 'Real copy', desc: 'Compelling startup messaging written by AI' },
      ],
      mockup: 'terminal',
      visualLeft: true,
    },
    {
      gradient: 'linear-gradient(135deg, #f97316, #fbbf24)',
      title: 'Test your messaging fast',
      description: "Not sure which angle resonates? Generate three different versions of your landing page with different headlines and value props. Test them, pick the winner, move on.",
      subs: [
        { title: 'Multiple variants', desc: 'Generate versions with different copy' },
        { title: 'Edit instantly', desc: 'Iterate on messaging in seconds' },
        { title: 'Own your code', desc: 'Download files, host anywhere' },
      ],
      mockup: 'edit',
      visualLeft: false,
    },
    {
      gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      title: 'SEO from day one',
      description: 'Your competitors are paying agencies thousands for SEO. Every Vibbr page includes schema markup, meta tags, Open Graph and sitemap automatically. Rank before you raise.',
      subs: [
        { title: 'Zero setup', desc: 'SEO configured automatically' },
        { title: 'Startup schema', desc: 'Structured data for your company' },
        { title: 'Share-ready', desc: 'Perfect OG tags for Product Hunt launches' },
      ],
      mockup: 'seo',
      visualLeft: true,
    },
  ],
  testimonial: {
    quote: 'I validated my SaaS idea with a Vibbr landing page before writing any code. Got 200 waitlist signups in the first week.',
    name: 'Pedro Almeida',
    role: 'Founder',
  },
};

export default function Page() {
  return <SolutionPage data={data} />;
}
