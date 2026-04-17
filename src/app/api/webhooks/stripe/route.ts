import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const planCredits: Record<string, number> = {
  starter: 30,
  pro: 100,
};

export async function POST(request: NextRequest): Promise<Response> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Webhook verification failed';
    console.error('Stripe webhook error:', msg);
    return Response.json({ error: msg }, { status: 400 });
  }

  const db = serviceClient();

  try {
    if (event.type === 'checkout.session.completed') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = event.data.object as any;
      const { userId, plan, credits } = (session.metadata ?? {}) as Record<string, string | undefined>;

      if (!userId) {
        console.error('Webhook: missing userId in metadata');
        return new Response(null, { status: 200 });
      }

      if (plan) {
        const creditAmount = planCredits[plan] ?? 0;
        const { error } = await db
          .from('profiles')
          .update({ plan, credits: creditAmount })
          .eq('id', userId);
        if (error) console.error('Webhook: failed to update plan:', error.message);
      } else if (credits) {
        const creditAmount = parseInt(credits, 10);
        if (!isNaN(creditAmount)) {
          const { data: profileData } = await db
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();
          const current = (profileData as { credits: number } | null)?.credits ?? 0;
          const { error } = await db
            .from('profiles')
            .update({ credits: current + creditAmount })
            .eq('id', userId);
          if (error) console.error('Webhook: failed to increment credits:', error.message);
        }
      }
    } else if (event.type === 'invoice.payment_succeeded') {
      // Use customer ID to find the profile and reset credits based on current plan.
      // This avoids all Stripe subscription type issues.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoice = event.data.object as any;
      const customerId = typeof invoice.customer === 'string'
        ? invoice.customer
        : (invoice.customer as { id?: string } | null)?.id ?? null;

      if (!customerId) {
        console.error('Webhook: missing customer on invoice');
        return new Response(null, { status: 200 });
      }

      // Look up the profile whose stripe_customer_id matches
      const { data: profileData, error: profileError } = await db
        .from('profiles')
        .select('id, plan')
        .eq('stripe_customer_id', customerId)
        .single();

      if (profileError || !profileData) {
        // Not fatal — customer may not have a profile row yet
        return new Response(null, { status: 200 });
      }

      const profile = profileData as { id: string; plan: string };
      const creditAmount = planCredits[profile.plan] ?? 0;

      if (creditAmount > 0) {
        const { error } = await db
          .from('profiles')
          .update({ credits: creditAmount })
          .eq('id', profile.id);
        if (error) console.error('Webhook: failed to reset credits on renewal:', error.message);
      }
    }
  } catch (e) {
    console.error('Webhook handler error:', e instanceof Error ? e.message : e);
  }

  return new Response(null, { status: 200 });
}
