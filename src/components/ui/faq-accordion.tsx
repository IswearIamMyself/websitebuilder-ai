'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'Do I need to know how to code?',
    a: 'Not at all. Vibbr generates complete websites from plain English descriptions. Just describe your business and we handle everything else.',
  },
  {
    q: 'What does Vibbr actually generate?',
    a: 'Vibbr creates complete HTML, CSS and JavaScript files — real production code, not a page builder. You can download the files, host them anywhere, or use your vibbr.app subdomain.',
  },
  {
    q: 'Is SEO really included?',
    a: 'Yes, automatically. Every site includes meta tags, Open Graph, JSON-LD schema markup, a canonical URL, and a sitemap.xml — without you configuring anything.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. Free plan includes a yoursite.vibbr.app subdomain. Starter and Pro plans let you connect any custom domain with a simple CNAME record.',
  },
  {
    q: "How do I edit a site after it's generated?",
    a: "Type what you want changed in plain English — 'make the hero darker' or 'add a contact form' — and Vibbr updates the files and reloads the preview.",
  },
  {
    q: 'What happens if I run out of credits?',
    a: 'You can buy more anytime from your dashboard. Credit packs start at €7 for 10 credits. No subscription required.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {FAQS.map((faq, i) => (
        <div key={i} className="border-b border-zinc-100 py-5">
          <button
            type="button"
            className="flex justify-between items-center w-full text-left"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="text-zinc-900 font-medium text-base">{faq.q}</span>
            <span
              className="text-zinc-400 text-xl ml-4 shrink-0"
              style={{
                display: 'inline-block',
                transform: openIndex === i ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            >
              +
            </span>
          </button>
          {openIndex === i && (
            <p className="text-zinc-500 text-sm leading-relaxed mt-3">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
