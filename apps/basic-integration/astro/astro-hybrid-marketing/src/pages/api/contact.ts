import type { APIRoute } from 'astro';
import { getPostHogLogger } from '../../lib/posthog-logs';

export const prerender = false;

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  interest: string;
  message: string;
}

export const POST: APIRoute = async ({ request }) => {
  const logger = getPostHogLogger();

  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.interest || !data.message) {
      logger?.emit({
        severityText: 'WARN',
        body: 'Contact form submission rejected because required fields were missing.',
        attributes: { route: '/api/contact', reason: 'missing_required_fields' },
      });
      return new Response(
        JSON.stringify({ error: 'Please fill in all required fields.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      logger?.emit({
        severityText: 'WARN',
        body: 'Contact form submission rejected because the email format was invalid.',
        attributes: { route: '/api/contact', reason: 'invalid_email_format' },
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

    logger?.emit({
      severityText: 'INFO',
      body: 'Contact form submission passed validation.',
      attributes: { route: '/api/contact', outcome: 'validated' },
    });

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
    logger?.emit({
      severityText: 'ERROR',
      body: 'Contact form processing failed.',
      attributes: { route: '/api/contact', outcome: 'failed' },
    });
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
