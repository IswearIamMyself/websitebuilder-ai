import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

type Plan = 'starter' | 'pro';
type CreditAmount = 10 | 30 | 70;

interface PlanBody {
  plan: Plan;
}

interface CreditsBody {
  credits: CreditAmount;
}

type RequestBody = PlanBody | CreditsBody;

function isPlanBody(b: RequestBody): b is PlanBody {
  return 'plan' in b;
}

const creditPrices: Record<CreditAmount, number> = {
  10: 700,
  30: 1800,
  70: 3500,
};

async function createAnonClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch { /* route handler */ }
        },
      },
    },
  );
}

export async function POST(request: NextRequest): Promise<Response> {
  // Auth
  const anonClient = await createAnonClient();
  const { data: { user }, error: authError } = await anonClient.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  let session: Stripe.Checkout.Session;

  if (isPlanBody(body)) {
    const { plan } = body;
    if (plan !== 'starter' && plan !== 'pro') {
      return Response.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const priceId = plan === 'starter'
      ? process.env.STRIPE_PRICE_STARTER!
      : process.env.STRIPE_PRICE_PRO!;

    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/dashboard/upgrade`,
      metadata: { userId: user.id, plan },
    });
  } else {
    const { credits } = body;
    if (credits !== 10 && credits !== 30 && credits !== 70) {
      return Response.json({ error: 'Invalid credits amount' }, { status: 400 });
    }

    const unitAmount = creditPrices[credits];

    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: unitAmount,
            product_data: { name: `${credits} Vibbr Credits` },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?credits_added=true`,
      cancel_url: `${appUrl}/dashboard/upgrade`,
      metadata: { userId: user.id, credits: String(credits) },
    });
  }

  return Response.json({ url: session.url });
}
