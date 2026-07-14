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
  const sessionId = request.headers.get('X-PostHog-Session-Id');
  const clientDistinctId = request.headers.get('X-PostHog-Distinct-Id');

  try {
    const data: ContactFormData = await request.json();
    const distinctId = clientDistinctId || data.email;

    // Validate required fields
    if (!data.name || !data.email || !data.interest || !data.message) {
      posthog.capture({
        distinctId,
        event: 'contact_form_submission_failed',
        properties: {
          $session_id: sessionId || undefined,
          failure_reason: 'missing_required_fields',
          interest: data.interest || 'unknown',
          has_company: Boolean(data.company),
        },
      });
      await posthog.flush();

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
        event: 'contact_form_submission_failed',
        properties: {
          $session_id: sessionId || undefined,
          failure_reason: 'invalid_email',
          interest: data.interest,
          has_company: Boolean(data.company),
        },
      });
      await posthog.flush();

      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    posthog.identify({
      distinctId,
      properties: {
        email: data.email,
        name: data.name,
        company: data.company,
        lead_interest: data.interest,
      },
    });

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
      event: 'contact_form_submission_recorded',
      properties: {
        $session_id: sessionId || undefined,
        interest: data.interest,
        has_company: Boolean(data.company),
        message_length_bucket: data.message.length > 500 ? '500_plus' : data.message.length > 200 ? '200_500' : '0_200',
        source: 'api',
      },
    });
    await posthog.flush();

    return new Response(
      JSON.stringify({
        message: 'Thank you! We\'ll be in touch within 24 hours.',
        success: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    posthog.captureException(error, clientDistinctId || 'anonymous_contact');
    await posthog.flush();
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
