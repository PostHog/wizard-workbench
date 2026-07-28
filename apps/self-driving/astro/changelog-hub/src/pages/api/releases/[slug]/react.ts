import type { APIRoute } from 'astro';
import { react } from '../../../../lib/releases';

export const POST: APIRoute = ({ params }) => {
  const release = params.slug ? react(params.slug) : undefined;

  if (!release) {
    return new Response(JSON.stringify({ error: 'release not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(release), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
