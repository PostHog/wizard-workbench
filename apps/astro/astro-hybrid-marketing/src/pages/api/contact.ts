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
  // Get PostHog session/distinct ID from client for unified tracking
  const sessionId = request.headers.get('X-PostHog-Session-Id');
  const distinctId = request.headers.get('X-PostHog-Distinct-Id');
  const posthog = getPostHogServer();

  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.interest || !data.message) {
      // Track validation error server-side
      posthog.capture({
        distinctId: distinctId || 'anonymous',
        event: 'contact_form_failed',
        properties: {
          $session_id: sessionId || undefined,
          error_type: 'validation_missing_fields',
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
      // Track validation error server-side
      posthog.capture({
        distinctId: distinctId || 'anonymous',
        event: 'contact_form_failed',
        properties: {
          $session_id: sessionId || undefined,
          error_type: 'validation_invalid_email',
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
      name: data.name,
      email: data.email,
      company: data.company || 'N/A',
      interest: data.interest,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    // Track successful form completion server-side
    posthog.capture({
      distinctId: distinctId || 'anonymous',
      event: 'contact_form_completed',
      properties: {
        $session_id: sessionId || undefined,
        interest: data.interest,
        has_company: !!data.company,
        source: 'api',
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Thank you! We\'ll be in touch within 24 hours.',
        success: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    // Track server error
    posthog.capture({
      distinctId: distinctId || 'anonymous',
      event: 'contact_form_failed',
      properties: {
        $session_id: sessionId || undefined,
        error_type: 'server_error',
        source: 'api',
      },
    });

    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
