import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

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

function serviceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> },
): Promise<Response> {
  const { siteId } = await params;

  // Auth
  const anonClient = await createAnonClient();
  const { data: { user }, error: authError } = await anonClient.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse body
  let body: { domain?: string };
  try {
    body = (await request.json()) as { domain?: string };
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { domain } = body;
  if (!domain || typeof domain !== 'string') {
    return Response.json({ error: 'domain is required' }, { status: 400 });
  }

  const db = serviceClient();

  // Verify ownership
  const { data: siteData, error: siteError } = await db
    .from('sites')
    .select('id, user_id')
    .eq('id', siteId)
    .single();

  if (siteError || !siteData) {
    return Response.json({ error: 'Site not found' }, { status: 404 });
  }

  const site = siteData as { id: string; user_id: string };
  if (site.user_id !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Update
  const { error: updateError } = await db
    .from('sites')
    .update({ custom_domain: domain })
    .eq('id', siteId);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
