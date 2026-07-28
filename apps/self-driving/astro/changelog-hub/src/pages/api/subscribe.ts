import type { APIRoute } from 'astro';
import { subscribe } from '../../lib/releases';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';

  if (!email.includes('@')) {
    return new Response(JSON.stringify({ error: 'a valid email is required' }), { status: 400 });
  }

  return new Response(JSON.stringify(subscribe(email)), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
