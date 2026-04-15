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

function validateContactForm(data: ContactFormData): string | null {
  if (!data.name || !data.email || !data.interest || !data.message) {
    return 'missing_fields';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return 'invalid_format';
  }
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  const sessionId = request.headers.get('X-PostHog-Session-Id') || undefined;
  // Use the client-provided session ID as the distinct ID to correlate with client events.
  // Fall back to 'anonymous' — never use PII (e.g. email) as distinctId.
  const distinctId = sessionId || 'anonymous';
  const posthog = getPostHogServer();

  try {
    const data: ContactFormData = await request.json();
    const validationError = validateContactForm(data);

    if (validationError) {
      posthog.capture({
        distinctId,
        event: 'contact_form_validation_error',
        properties: {
          $session_id: sessionId,
          reason: validationError,
        },
      });
      return new Response(
        JSON.stringify({ error: 'Please check your submission and try again.' }),
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

    posthog.capture({
      distinctId,
      event: 'contact_form_received',
      properties: {
        $session_id: sessionId,
        source: 'contact_form',
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
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
