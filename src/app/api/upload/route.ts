import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { unzipSync, strFromU8 } from 'fflate';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

interface UploadedFile {
  path: string;
  content: string;
}

function randomChars(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function serviceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

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
  // 1. Auth
  const anonClient = await createAnonClient();
  const { data: { user }, error: authError } = await anonClient.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const uploadedFiles: UploadedFile[] = [];

  const zipEntry = formData.get('zip');
  if (zipEntry instanceof File) {
    // 3. Extract zip with fflate
    const arrayBuffer = await zipEntry.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    let entries: ReturnType<typeof unzipSync>;
    try {
      entries = unzipSync(uint8);
    } catch {
      return Response.json({ error: 'Invalid ZIP file' }, { status: 400 });
    }
    for (const [path, data] of Object.entries(entries)) {
      // Skip directories
      if (path.endsWith('/')) continue;
      uploadedFiles.push({ path, content: strFromU8(data) });
    }
  } else {
    const fileEntries = formData.getAll('files');
    for (const entry of fileEntries) {
      if (!(entry instanceof File)) continue;
      const content = await entry.text();
      uploadedFiles.push({ path: entry.name, content });
    }
  }

  if (uploadedFiles.length === 0) {
    return Response.json({ error: 'No files provided' }, { status: 400 });
  }

  const db = serviceClient();

  // 4. Create site row
  const subdomain = `upload-${randomChars(4)}`;
  const { data: siteData, error: siteError } = await db
    .from('sites')
    .insert({ user_id: user.id, name: 'Uploaded Site', subdomain })
    .select('id')
    .single();

  if (siteError || !siteData) {
    return Response.json({ error: siteError?.message ?? 'Failed to create site' }, { status: 500 });
  }

  const siteId = (siteData as { id: string }).id;

  // 5. Save files
  const fileRows = uploadedFiles.map((f) => ({
    site_id: siteId,
    file_path: f.path,
    content: f.content,
  }));

  const { error: filesError } = await db.from('site_files').insert(fileRows);
  if (filesError) {
    return Response.json({ error: filesError.message }, { status: 500 });
  }

  return Response.json({ siteId, files: uploadedFiles });
}
