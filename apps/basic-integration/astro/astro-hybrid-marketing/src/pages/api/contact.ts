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
  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.interest || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Please fill in all required fields.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In a real app, you would:
    // 1. Send to a CRM or email service
    // 2. Store in a database
    // 3. Trigger notifications

    const posthog = getPostHogServer();
    const distinctId = request.headers.get('X-PostHog-Distinct-Id') || crypto.randomUUID();
    const sessionId = request.headers.get('X-PostHog-Session-Id');

    posthog.capture({
      distinctId,
      event: 'contact_request_received',
      properties: {
        $session_id: sessionId || undefined,
        interest: data.interest,
        source: 'contact_api',
      },
    });
    await posthog.flush();

    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      company: data.company || 'N/A',
      interest: data.interest,
      message: data.message,
      timestamp: new Date().toISOString(),
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
    const posthog = getPostHogServer();
    const distinctId = request.headers.get('X-PostHog-Distinct-Id') || crypto.randomUUID();
    const sessionId = request.headers.get('X-PostHog-Session-Id');
    posthog.captureException(error, distinctId, {
      $session_id: sessionId || undefined,
      event_name: 'contact_request_failed',
      source: 'contact_api',
    });
    await posthog.flush();
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
