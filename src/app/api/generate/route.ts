import Anthropic from '@anthropic-ai/sdk';
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface GenerateRequestBody {
  prompt: string;
  siteId?: string;
  existingFiles?: GeneratedFile[];
}

interface GeneratedFile {
  path: string;
  content: string;
}

interface GeneratedSite {
  siteName: string;
  description: string;
  files: GeneratedFile[];
}

interface Profile {
  id: string;
  credits: number;
}

interface Site {
  id: string;
  subdomain: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function cleanJSON(raw: string): string {
  return raw
    .replace(/^[\s\S]*?(?=\{)/, '')   // strip everything before first {
    .replace(/\}[\s\S]*$/, (m) => m.slice(0, m.lastIndexOf('}') + 1)) // trim after last }
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .replace(/`/g, '')
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function randomChars(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function err(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

/* ─── Supabase clients ───────────────────────────────────────────────────────── */

async function createAnonClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Route handler — cookies are readable but writes go via middleware
          }
        },
      },
    },
  );
}

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/* ─── System prompt ──────────────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `CRITICAL INSTRUCTION: Your ENTIRE response must be raw JSON. The very first character must be { and the very last character must be }. Do NOT wrap in markdown, do NOT use code fences, do NOT write any text before or after the JSON object. Any deviation will break the parser.

You are Vibbr's website generation engine. Generate complete, production-quality, SEO-optimized websites.

Respond ONLY with a valid JSON object, no markdown, no fences:
{
  "siteName": "short name",
  "description": "one sentence",
  "files": [
    { "path": "index.html", "content": "..." },
    { "path": "css/style.css", "content": "..." },
    { "path": "js/main.js", "content": "..." }
  ]
}

Every index.html must include: proper meta tags, og tags, JSON-LD schema, semantic HTML5, aria labels, canonical tag.
Design must be modern and impressive — not generic Bootstrap.
Use Google Fonts. CSS custom properties. Mobile-first responsive.
Real content — no Lorem Ipsum. Unsplash images with descriptive alts.
Vanilla JS only. No external JS dependencies.
If existingFiles provided, preserve structure and only change what was specifically requested.`;

/* ─── Route handler ──────────────────────────────────────────────────────────── */

export async function POST(request: NextRequest): Promise<Response> {
  // 1. Authenticate
  const anonClient = await createAnonClient();
  const {
    data: { user },
    error: authError,
  } = await anonClient.auth.getUser();

  if (authError || !user) {
    return err('Unauthorized', 401);
  }

  // Parse body
  let body: GenerateRequestBody;
  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return err('Invalid JSON body', 400);
  }

  const { prompt, siteId, existingFiles } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return err('prompt is required', 400);
  }

  // 2. Check credits
  const serviceClient = createServiceClient();
  const { data: profileData, error: profileError } = await serviceClient
    .from('profiles')
    .select('id, credits')
    .eq('id', user.id)
    .single();

  if (profileError || !profileData) {
    return err('Profile not found', 404);
  }

  const profile = profileData as Profile;

  if (profile.credits < 1) {
    return err('No credits remaining', 402);
  }

  // 3. Call Anthropic
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const userMessage =
    existingFiles && existingFiles.length > 0
      ? `Existing files:\n${JSON.stringify(existingFiles, null, 2)}\n\nEdit request: ${prompt}`
      : prompt;

  let anthropicResponse: Anthropic.Message;
  try {
    anthropicResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Anthropic API error';
    return err(message, 502);
  }

  // 4. Parse JSON from response
  const rawContent = anthropicResponse.content[0];
  if (!rawContent || rawContent.type !== 'text') {
    return err('Unexpected response format from AI', 502);
  }

  const cleaned = cleanJSON(rawContent.text);

  let generated: GeneratedSite;
  try {
    generated = JSON.parse(cleaned) as GeneratedSite;
  } catch {
    return err('AI returned invalid JSON', 502);
  }

  if (
    !generated.siteName ||
    !Array.isArray(generated.files) ||
    generated.files.length === 0
  ) {
    return err('AI response missing required fields', 502);
  }

  // 5. Create site row if no siteId
  let resolvedSiteId = siteId;
  let subdomain: string;

  if (!resolvedSiteId) {
    subdomain = `${slugify(generated.siteName)}-${randomChars(4)}`;

    const { data: siteData, error: siteError } = await serviceClient
      .from('sites')
      .insert({
        user_id: user.id,
        name: generated.siteName,
        description: generated.description ?? null,
        subdomain,
      })
      .select('id, subdomain')
      .single();

    if (siteError || !siteData) {
      return err(siteError?.message ?? 'Failed to create site', 500);
    }

    const site = siteData as Site;
    resolvedSiteId = site.id;
    subdomain = site.subdomain;
  } else {
    const { data: siteData, error: siteError } = await serviceClient
      .from('sites')
      .select('id, subdomain')
      .eq('id', resolvedSiteId)
      .single();

    if (siteError || !siteData) {
      return err('Site not found', 404);
    }

    subdomain = (siteData as Site).subdomain;
  }

  // 6. Upsert files
  const fileRows = generated.files.map((f) => ({
    site_id: resolvedSiteId,
    file_path: f.path,
    content: f.content,
  }));

  const { error: upsertError } = await serviceClient
    .from('site_files')
    .upsert(fileRows, { onConflict: 'site_id,file_path' });

  if (upsertError) {
    return err(upsertError.message, 500);
  }

  // 7. Decrement credits
  const { error: creditError } = await serviceClient
    .from('profiles')
    .update({ credits: profile.credits - 1 })
    .eq('id', user.id);

  if (creditError) {
    return err(creditError.message, 500);
  }

  // 8. Record generation
  const { error: genError } = await serviceClient.from('generations').insert({
    user_id: user.id,
    site_id: resolvedSiteId,
    prompt,
    tokens_in: anthropicResponse.usage.input_tokens,
    tokens_out: anthropicResponse.usage.output_tokens,
  });

  if (genError) {
    // Non-fatal — log but don't fail the request
    console.error('Failed to record generation:', genError.message);
  }

  // 9. Return result
  return Response.json({
    siteId: resolvedSiteId,
    subdomain,
    files: generated.files,
    siteName: generated.siteName,
  });
}
