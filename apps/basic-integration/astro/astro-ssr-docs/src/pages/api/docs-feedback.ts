import type { APIRoute } from 'astro';
import { getPostHogServer } from '../../lib/posthog-server';

export const POST: APIRoute = async ({ request }) => {
  const posthog = getPostHogServer();

  try {
    const body = await request.json();
    const page = typeof body.page === 'string' ? body.page : '';
    const rating = typeof body.rating === 'string' ? body.rating : '';
    const hasMessage = Boolean(body.has_message);
    const sessionId = request.headers.get('X-PostHog-Session-Id') || undefined;
    const distinctIdHeader = request.headers.get('X-PostHog-Distinct-Id') || undefined;
    const distinctId = distinctIdHeader || sessionId || 'anonymous_docs_feedback';

    if (!page || !rating) {
      return new Response(JSON.stringify({ error: 'Page and rating are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    posthog.capture({
      distinctId,
      event: 'docs_feedback_received',
      properties: {
        $session_id: sessionId,
        page,
        rating,
        has_message: hasMessage,
        source: 'api',
      },
    });

    await posthog.flush();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    posthog.captureException(error, 'anonymous_docs_feedback', {
      source: 'api',
      route: '/api/docs-feedback',
    });

    posthog.capture({
      distinctId: 'anonymous_docs_feedback',
      event: 'docs_feedback_failed',
      properties: {
        source: 'api',
        route: '/api/docs-feedback',
      },
    });

    await posthog.flush();

    return new Response(JSON.stringify({ error: 'Unable to process feedback' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
