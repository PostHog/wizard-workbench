import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.PUBLIC_POSTHOG_HOST;
const isDevelopment = import.meta.env.DEV;

let logProcessor: BatchLogRecordProcessor | undefined;
let posthogLogger: ReturnType<typeof logs.getLogger> | undefined;

if (!projectToken || !posthogHost) {
  if (isDevelopment) {
    const missingVariable = !projectToken
      ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
      : 'PUBLIC_POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  const logsEndpoint = new URL('/i/v1/logs', posthogHost).toString();

  logProcessor = new BatchLogRecordProcessor(
    new OTLPLogExporter({
      url: logsEndpoint,
      headers: { Authorization: `Bearer ${projectToken}` },
    }),
  );

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing',
    }),
    logRecordProcessors: [logProcessor],
  });

  sdk.start();
  posthogLogger = logs.getLogger('posthog-contact-log-exporter');
}

type ContactFormOutcome = 'validation_failed' | 'completed' | 'failed';

export function logContactFormOutcome(outcome: ContactFormOutcome): void {
  posthogLogger?.emit({
    severityText: outcome === 'failed' ? 'ERROR' : 'INFO',
    body: 'contact_form_request_completed',
    attributes: {
      route: '/api/contact',
      outcome,
    },
  });
}

export async function flushPostHogLogs(): Promise<void> {
  try {
    await logProcessor?.forceFlush();
  } catch {
    // Log delivery must not change the API response.
  }
}
