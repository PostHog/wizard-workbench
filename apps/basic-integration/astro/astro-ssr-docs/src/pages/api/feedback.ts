import type { APIRoute } from 'astro';
import { getPostHogServer } from '../../lib/posthog-server';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { page, helpful, distinctId } = body;

    if (!page || helpful === undefined) {
      return new Response(JSON.stringify({ error: 'page and helpful fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const posthog = getPostHogServer();
    const sessionId = request.headers.get('X-PostHog-Session-Id');
    const resolvedDistinctId = distinctId || request.headers.get('X-PostHog-Distinct-Id') || 'anonymous';

    posthog.capture({
      distinctId: resolvedDistinctId,
      event: 'docs_feedback_submitted',
      properties: {
        $session_id: sessionId || undefined,
        page,
        helpful,
        source: 'api',
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
