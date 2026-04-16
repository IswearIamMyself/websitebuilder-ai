import dns from 'node:dns/promises';
import type { NextRequest } from 'next/server';

const TARGET = 'sites.vibbr.app';

export async function GET(request: NextRequest): Promise<Response> {
  const domain = request.nextUrl.searchParams.get('domain');

  if (!domain || typeof domain !== 'string' || domain.trim().length === 0) {
    return Response.json({ verified: false, error: 'domain query param is required' }, { status: 400 });
  }

  try {
    const records = await dns.resolveCname(domain.trim());
    const verified = records.some(
      (r) => r === TARGET || r === `${TARGET}.`,
    );
    return Response.json({ verified });
  } catch {
    return Response.json({ verified: false });
  }
}
