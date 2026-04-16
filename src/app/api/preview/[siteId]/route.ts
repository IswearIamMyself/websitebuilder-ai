import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

interface SiteFile {
  content: string;
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> },
): Promise<Response> {
  const { siteId } = await params;

  const { data, error } = await serviceClient()
    .from('site_files')
    .select('content')
    .eq('site_id', siteId)
    .eq('file_path', 'index.html')
    .single();

  if (error || !data) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const file = data as SiteFile;

  // Inject <base> into <head> so relative asset paths resolve through the
  // catch-all route handler at /api/preview/[siteId]/
  const base = `<base href="/api/preview/${siteId}/">`;
  const html = file.content.replace(/(<head\b[^>]*>)/i, `$1\n  ${base}`);

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
