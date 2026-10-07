import type { APIRoute } from 'astro';
import { flushPostHogLogs, getPostHogLogger } from '../../lib/posthog-logs';
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
      getPostHogLogger()?.emit({
        severityText: 'WARN',
        body: 'contact form request rejected',
        attributes: {
          route: '/api/contact',
          outcome: 'missing_required_fields',
          status_code: 400,
        },
      });
      await flushPostHogLogs();
      return new Response(
        JSON.stringify({ error: 'Please fill in all required fields.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      getPostHogLogger()?.emit({
        severityText: 'WARN',
        body: 'contact form request rejected',
        attributes: {
          route: '/api/contact',
          outcome: 'invalid_email_format',
          status_code: 400,
        },
      });
      await flushPostHogLogs();
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

    getPostHogLogger()?.emit({
      severityText: 'INFO',
      body: 'contact form request accepted',
      attributes: {
        route: '/api/contact',
        outcome: 'validated',
        status_code: 200,
      },
    });

    const posthog = getPostHogServer();
    if (posthog) {
      try {
        const distinctId = request.headers.get('X-PostHog-Distinct-Id');
        const sessionId = request.headers.get('X-PostHog-Session-Id');

        posthog.capture({
          distinctId: distinctId || undefined,
          event: 'contact_form_submitted',
          properties: {
            interest: data.interest,
            source: 'api',
            $session_id: sessionId || undefined,
          },
        });
        await posthog.flush();
      } catch (error) {
        console.error('PostHog contact event error:', error);
      }
    }

    await flushPostHogLogs();
    return new Response(
      JSON.stringify({
        message: 'Thank you! We\'ll be in touch within 24 hours.',
        success: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    getPostHogLogger()?.emit({
      severityText: 'ERROR',
      body: 'contact form request failed',
      attributes: {
        route: '/api/contact',
        outcome: 'unhandled_error',
        status_code: 500,
      },
    });
    console.error('Contact form error:', error);
    await flushPostHogLogs();
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
