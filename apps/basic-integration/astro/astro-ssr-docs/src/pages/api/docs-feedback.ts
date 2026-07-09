import type { APIRoute } from 'astro';
import { getPostHogServer } from '../../lib/posthog-server';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const feedback = body?.feedback === 'helpful' ? 'helpful' : 'needs_improvement';
    const page = typeof body?.page === 'string' ? body.page : 'unknown';
    const contentType = typeof body?.contentType === 'string' ? body.contentType : 'docs';
    const distinctIdHeader = request.headers.get('X-POSTHOG-DISTINCT-ID');
    const sessionId = request.headers.get('X-PostHog-Session-Id');
    const distinctId = distinctIdHeader && distinctIdHeader !== 'null' ? distinctIdHeader : `docs-feedback:${page}:${feedback}`;

    const posthog = getPostHogServer();

    posthog.capture({
      distinctId,
      event: 'docs_content_feedback_submitted',
      properties: {
        $session_id: sessionId || undefined,
        feedback,
        page,
        content_type: contentType,
        source: 'api',
      },
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    getPostHogServer().captureException(error);

    return new Response(JSON.stringify({ error: 'Unable to submit feedback' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
