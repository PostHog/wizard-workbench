import type { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let logger: Logger | null = null;
let logProvider: LoggerProvider | null = null;

function getPostHogLogger() {
  if (logger) {
    return logger;
  }

  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken) {
    if (import.meta.env.DEV) {
      throw new Error('PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured');
    }
    return null;
  }

  if (!host) {
    if (import.meta.env.DEV) {
      throw new Error('PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured');
    }
    return null;
  }

  logProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      ),
    ],
  });

  logger = logProvider.getLogger('posthog-contact-route');
  return logger;
}

async function emitContactLog(severityText: 'info' | 'warn' | 'error', body: string) {
  const posthogLogger = getPostHogLogger();
  if (!posthogLogger || !logProvider) {
    return;
  }

  posthogLogger.emit({ severityText, body });

  try {
    await logProvider.forceFlush();
  } catch {
    // Log delivery must not alter the contact endpoint's response.
  }
}

export function logContactFormValidationFailure(validation: 'missing_fields' | 'invalid_email') {
  return emitContactLog('warn', `contact_form_validation_failed:${validation}`);
}

export function logContactFormAccepted() {
  return emitContactLog('info', 'contact_form_accepted');
}

export function logContactFormRequestError() {
  return emitContactLog('error', 'contact_form_request_error');
}
