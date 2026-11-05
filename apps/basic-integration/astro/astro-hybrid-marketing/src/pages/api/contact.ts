import type { APIRoute } from 'astro';
import { flushPostHogLogs, getPostHogLogger } from '../../lib/posthog-logs';

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
        body: 'contact_form_validation_failed',
        attributes: { validation_reason: 'missing_required_fields' },
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
        body: 'contact_form_validation_failed',
        attributes: { validation_reason: 'invalid_email_format' },
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
      body: 'contact_form_accepted',
      attributes: { interest: data.interest },
    });
    await flushPostHogLogs();

    return new Response(
      JSON.stringify({
        message: 'Thank you! We\'ll be in touch within 24 hours.',
        success: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    getPostHogLogger()?.emit({
      severityText: 'ERROR',
      body: 'contact_form_processing_failed',
    });
    await flushPostHogLogs();

    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
