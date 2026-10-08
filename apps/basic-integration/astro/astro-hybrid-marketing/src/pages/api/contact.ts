import type { APIRoute } from 'astro';
import { flushPostHogLogs, getPostHogLogLogger } from '../../lib/posthog-logs';
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

    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      company: data.company || 'N/A',
      interest: data.interest,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    const posthog = getPostHogServer();
    if (posthog) {
      posthog.capture({
        event: 'contact_form_submitted',
        properties: {
          interest: data.interest,
          source: 'api',
        },
      });
      await posthog.flush().catch(() => undefined);
    }

    getPostHogLogLogger()?.emit({
      severityText: 'INFO',
      body: 'contact form accepted',
      attributes: {
        event: 'contact_form_processed',
        outcome: 'accepted',
        interest: data.interest,
        source: 'api',
        response_status: 200,
      },
    });
    await flushPostHogLogs().catch(() => undefined);

    return new Response(
      JSON.stringify({
        message: 'Thank you! We\'ll be in touch within 24 hours.',
        success: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    getPostHogLogLogger()?.emit({
      severityText: 'ERROR',
      body: 'contact form request failed',
      attributes: {
        event: 'contact_form_processed',
        outcome: 'failed',
        error_type: error instanceof Error ? error.name : 'unknown_error',
        source: 'api',
        response_status: 500,
      },
    });
    await flushPostHogLogs().catch(() => undefined);

    const posthog = getPostHogServer();
    const distinctId = request.headers.get('X-PostHog-Distinct-Id');
    if (posthog && distinctId) {
      const exception = error instanceof Error ? error : new Error('Contact form request failed');
      posthog.captureException(exception, distinctId);
      await posthog.flush().catch(() => undefined);
    }

    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
