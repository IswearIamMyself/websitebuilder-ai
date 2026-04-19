import type { Metadata } from 'next';
import SiteNav from '@/components/ui/site-nav';
import BlogContent from '@/components/ui/blog-content';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tips, updates and stories from the Vibbr team.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0f0f12' }}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            width: 600, height: 600,
            top: -100, left: -100,
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 400, height: 400,
            bottom: 0, right: 0,
            background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <SiteNav />

      <main className="relative z-10 pt-32 pb-20 px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Blog</h1>
          <p className="mt-3 text-zinc-400">Tips, updates and stories from the Vibbr team.</p>
        </div>

        <BlogContent />
      </main>
    </div>
  );
}
