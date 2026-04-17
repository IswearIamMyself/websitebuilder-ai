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
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, plan, credits } = session.metadata ?? {};

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
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof (invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }).subscription === 'string'
        ? (invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }).subscription
        : ((invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }).subscription as Stripe.Subscription | null)?.id ?? null;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const plan = subscription.metadata?.plan as string | undefined;

        if (plan) {
          const userId = subscription.metadata?.userId;
          const creditAmount = planCredits[plan] ?? 0;
          if (userId) {
            const { error } = await db
              .from('profiles')
              .update({ credits: creditAmount })
              .eq('id', userId);
            if (error) console.error('Webhook: failed to reset credits on renewal:', error.message);
          }
        }
      }
    }
  } catch (e) {
    console.error('Webhook handler error:', e instanceof Error ? e.message : e);
  }

  return new Response(null, { status: 200 });
}
