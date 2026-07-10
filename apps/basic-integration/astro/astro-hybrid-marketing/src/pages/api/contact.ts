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
  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') || crypto.randomUUID();
  const sessionId = request.headers.get('X-POSTHOG-SESSION-ID') || undefined;

  try {
    const data: ContactFormData = await request.json();

    if (data.email) {
      posthog.identify({
        distinctId,
        properties: {
          email: data.email,
          name: data.name,
          company: data.company,
          interest: data.interest,
          lead_source: 'contact_form',
        },
      });
    }

    // Validate required fields
    if (!data.name || !data.email || !data.interest || !data.message) {
      posthog.capture({
        distinctId,
        event: 'contact_form_validation_failed',
        properties: {
          $session_id: sessionId,
          reason: 'missing_required_fields',
          interest: data.interest || 'unknown',
          has_company: Boolean(data.company),
          source: 'api',
        },
      });

      return new Response(
        JSON.stringify({ error: 'Please fill in all required fields.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      posthog.capture({
        distinctId,
        event: 'contact_form_validation_failed',
        properties: {
          $session_id: sessionId,
          reason: 'invalid_email',
          interest: data.interest,
          has_company: Boolean(data.company),
          source: 'api',
        },
      });

      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In a real app, you would:
    // 1. Send to a CRM or email service
    // 2. Store in a database
    // 3. Trigger notifications

    console.log('Contact form submission:', {
      interest: data.interest,
      hasCompany: Boolean(data.company),
      timestamp: new Date().toISOString(),
    });

    posthog.capture({
      distinctId,
      event: 'contact_form_received',
      properties: {
        $session_id: sessionId,
        interest: data.interest,
        has_company: Boolean(data.company),
        source: 'api',
      },
    });

    await posthog.shutdown();

    return new Response(
      JSON.stringify({
        message: 'Thank you! We\'ll be in touch within 24 hours.',
        success: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    posthog.capture({
      distinctId,
      event: 'contact_form_server_error',
      properties: {
        $session_id: sessionId,
        source: 'api',
      },
    });

    if (error instanceof Error) {
      posthog.captureException(error, distinctId, {
        $session_id: sessionId,
        endpoint: '/api/contact',
      });
    }

    await posthog.shutdown();

    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
