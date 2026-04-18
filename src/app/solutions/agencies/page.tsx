import type { Metadata } from 'next';
import SolutionPage, { type SolutionData } from '@/components/ui/solution-page';

export const metadata: Metadata = {
  title: 'Vibbr for Agencies',
  description: 'Build client sites 10x faster. Generate a complete website from a client brief in under a minute.',
};

const data: SolutionData = {
  label: 'Vibbr for agencies',
  heading: 'Build client sites in minutes, not weeks',
  subtext: 'Stop losing time to repetitive builds. Describe the site, Vibbr generates it. Your client sees a live preview instantly.',
  sectionHeader: 'What agencies build with Vibbr',
  features: [
    {
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      title: 'Generate from a client brief',
      description: "Paste the client's brief or describe their business and Vibbr writes the complete site — copy, design, code and all. Real content, not Lorem Ipsum.",
      subs: [
        { title: 'Brief to site', desc: 'Paste any description and get a full site' },
        { title: 'Real copy', desc: 'Actual business content written by AI' },
        { title: 'Instant preview', desc: 'Client sees it live in under 30 seconds' },
      ],
      mockup: 'terminal',
      visualLeft: true,
    },
    {
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      title: 'Every site is SEO-ready',
      description: 'Stop charging clients extra for SEO setup. Every Vibbr site includes meta tags, schema markup, Open Graph and a sitemap. Automatically. Every time.',
      subs: [
        { title: 'Meta tags', desc: 'Auto-generated for every page' },
        { title: 'Schema markup', desc: 'LocalBusiness JSON-LD included' },
        { title: 'Google-ready', desc: 'Sitemap and canonical URLs set' },
      ],
      mockup: 'seo',
      visualLeft: false,
    },
    {
      gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      title: 'Deliver faster, take more clients',
      description: 'A site that used to take 3 days now takes 3 minutes. Use the time you save to take on more projects and grow your agency.',
      subs: [
        { title: 'More volume', desc: 'Handle 10x more client projects' },
        { title: 'Edit instantly', desc: 'Client wants changes? Done in seconds' },
        { title: 'White label', desc: 'Custom domains for every client' },
      ],
      mockup: 'edit',
      visualLeft: true,
    },
  ],
  testimonial: {
    quote: 'I generated a full restaurant website in front of my client during our discovery call. They signed the contract on the spot.',
    name: 'Ricardo Fonseca',
    role: 'WebElite Agency',
  },
};

export default function Page() {
  return <SolutionPage data={data} />;
}
