import type { Metadata } from 'next';
import SolutionPage, { type SolutionData } from '@/components/ui/solution-page';

export const metadata: Metadata = {
  title: 'Vibbr for Marketers',
  description: 'Ship SEO-optimized landing pages in seconds. No developer. No CMS. Just describe it and go live.',
};

const data: SolutionData = {
  label: 'Vibbr for marketers',
  heading: 'Landing pages that rank and convert',
  subtext: 'Ship SEO-optimized landing pages in seconds. No developer. No CMS. No waiting. Just describe it and go live.',
  sectionHeader: 'What marketers build with Vibbr',
  heroBackground: 'linear-gradient(160deg, #0a0f0a 0%, #0d2818 18%, #0f4d2e 36%, #1a7a3a 58%, #2ecc71 80%, #f97316 100%)',
  features: [
    {
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
      title: 'Campaign pages in seconds',
      description: 'New product launch? Event page? Promo landing page? Describe it, generate it, go live. No engineering bottleneck. No CMS limitations. Ship while the idea is hot.',
      subs: [
        { title: 'Any campaign', desc: 'Launch, event, promo — all supported' },
        { title: 'Fast iteration', desc: 'Test different versions instantly' },
        { title: 'No CMS', desc: 'No templates, no restrictions' },
      ],
      mockup: 'terminal',
      visualLeft: true,
    },
    {
      gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
      title: 'Built for organic traffic',
      description: 'Every page Vibbr generates is structured for SEO from the ground up. Proper headings, meta tags, schema, Open Graph — everything search engines need to rank your page.',
      subs: [
        { title: 'Keyword-ready', desc: 'Semantic HTML structure throughout' },
        { title: 'OG tags', desc: 'Perfect social sharing previews' },
        { title: 'Schema', desc: 'Rich results eligible from day one' },
      ],
      mockup: 'seo',
      visualLeft: false,
    },
    {
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      title: 'Edit copy without a developer',
      description: "Need to update the headline? Change the CTA? Add a new section? Just type what you want changed and Vibbr updates the page. No tickets, no waiting, no agency fees.",
      subs: [
        { title: 'Instant edits', desc: 'Changes live in under 30 seconds' },
        { title: 'No dependencies', desc: 'You control your own pages' },
        { title: 'A/B friendly', desc: 'Generate variants of any page' },
      ],
      mockup: 'edit',
      visualLeft: true,
    },
  ],
  testimonial: {
    quote: 'We launched a campaign landing page in 4 minutes. It ranked on page one for our target keyword within a week.',
    name: 'Ana Pereira',
    role: 'Growth Lead',
  },
};

export default function Page() {
  return <SolutionPage data={data} />;
}
