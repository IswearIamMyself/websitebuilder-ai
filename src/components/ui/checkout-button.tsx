'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
  plan?: string;
  credits?: number;
  children: React.ReactNode;
  className?: string;
}

export default function CheckoutButton({ plan, credits, children, className }: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const body = plan ? { plan } : { credits };
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) router.push(data.url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
