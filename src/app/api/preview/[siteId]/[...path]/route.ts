import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

interface SiteFile {
  content: string;
}

const CONTENT_TYPES: Record<string, string> = {
  css:  'text/css; charset=utf-8',
  js:   'text/javascript; charset=utf-8',
  html: 'text/html; charset=utf-8',
  svg:  'image/svg+xml; charset=utf-8',
  png:  'image/png',
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  ico:  'image/x-icon',
};

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function contentTypeFor(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  return CONTENT_TYPES[ext] ?? 'application/octet-stream';
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string; path: string[] }> },
): Promise<Response> {
  const { siteId, path: segments } = await params;
  const filePath = segments.join('/');

  const { data, error } = await serviceClient()
    .from('site_files')
    .select('content')
    .eq('site_id', siteId)
    .eq('file_path', filePath)
    .single();

  if (error || !data) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const file = data as SiteFile;

  return new Response(file.content, {
    status: 200,
    headers: { 'Content-Type': contentTypeFor(filePath) },
  });
}
