import type { APIRoute } from 'astro';
import { getPostHogServer } from '../../lib/posthog-server';

export const prerender = false;

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  interest: string;
  message: string;
}

export const POST: APIRoute = async ({ request }) => {
  const posthog = getPostHogServer();
  const sessionId = request.headers.get('X-POSTHOG-SESSION-ID') || undefined;
  const anonymousDistinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') || undefined;

  try {
    const data: ContactFormData = await request.json();

    if (!data.name || !data.email || !data.interest || !data.message) {
      posthog.capture({
        distinctId: anonymousDistinctId || 'contact:anonymous',
        event: 'contact_request_rejected',
        properties: {
          $session_id: sessionId,
          source: 'api',
          rejection_reason: 'missing_required_fields',
          interest: data.interest || 'unknown',
        },
      });

      posthog.shutdown();

      return new Response(
        JSON.stringify({ error: 'Please fill in all required fields.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = data.email.trim().toLowerCase();
    const emailBytes = new TextEncoder().encode(normalizedEmail);
    const emailHashBuffer = await crypto.subtle.digest('SHA-256', emailBytes);
    const emailHash = Array.from(new Uint8Array(emailHashBuffer))
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('');
    const distinctId = `contact:${emailHash}`;

    posthog.identify({
      distinctId,
      properties: {
        email: normalizedEmail,
        contact_name: data.name.trim(),
        company: data.company?.trim() || undefined,
        interest: data.interest,
        $anon_distinct_id: anonymousDistinctId,
      },
    });

    posthog.capture({
      distinctId,
      event: 'contact_request_received',
      properties: {
        $session_id: sessionId,
        source: 'api',
        interest: data.interest,
        has_company: Boolean(data.company?.trim()),
        message_length: data.message.trim().length,
      },
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      posthog.capture({
        distinctId,
        event: 'contact_request_rejected',
        properties: {
          $session_id: sessionId,
          source: 'api',
          rejection_reason: 'invalid_email',
          interest: data.interest,
        },
      });

      posthog.shutdown();

      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      company: data.company || 'N/A',
      interest: data.interest,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    posthog.capture({
      distinctId,
      event: 'contact_request_completed',
      properties: {
        $session_id: sessionId,
        source: 'api',
        interest: data.interest,
        has_company: Boolean(data.company?.trim()),
        message_length: data.message.trim().length,
      },
    });

    posthog.shutdown();

    return new Response(
      JSON.stringify({
        message: 'Thank you! We\'ll be in touch within 24 hours.',
        success: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const fallbackDistinctId = anonymousDistinctId || 'contact:anonymous';

    posthog.captureException(error, fallbackDistinctId, {
      $session_id: sessionId,
      source: 'api',
      endpoint: '/api/contact',
    });
    posthog.capture({
      distinctId: fallbackDistinctId,
      event: 'contact_request_failed',
      properties: {
        $session_id: sessionId,
        source: 'api',
        error_type: error instanceof Error ? error.name : 'unknown_error',
      },
    });
    posthog.shutdown();
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
