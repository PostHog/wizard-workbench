import type { APIRoute } from 'astro';
import { getPostHogServer } from '../../../lib/posthog-server';

export const POST: APIRoute = async ({ request }) => {
  const posthog = getPostHogServer();

  try {
    const body = await request.json();
    const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') || 'anonymous-docs-visitor';
    const sessionId = request.headers.get('X-PostHog-Session-Id') || undefined;

    posthog.capture({
      distinctId,
      event: 'server_docs_cta_recorded',
      properties: {
        $session_id: sessionId,
        original_event: body.event || 'homepage_cta_clicked',
        cta_name: body.ctaName || 'unknown',
        destination: body.destination || '',
        source: body.source || 'homepage_hero',
      },
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    posthog.captureException(error, 'anonymous-docs-visitor', {
      area: 'docs_events_api',
      endpoint: '/api/events/docs',
    });

    return new Response(JSON.stringify({ error: 'Unable to record analytics event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
