import { logs, type Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

let posthogLogger: Logger | null = null;
let posthogLogProcessor: BatchLogRecordProcessor | null = null;
let initializationAttempted = false;

export function getPostHogLogger(): Logger | null {
  if (initializationAttempted) {
    return posthogLogger;
  }

  initializationAttempted = true;

  const apiKey = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const apiHost = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!apiKey || !apiHost) {
    if (import.meta.env.DEV) {
      const missingVariable = !apiKey
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      console.error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`);
    }
    return null;
  }

  posthogLogProcessor = new BatchLogRecordProcessor(
    new OTLPLogExporter({
      url: new URL('/i/v1/logs', apiHost).toString(),
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }),
  );

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing',
    }),
    logRecordProcessors: [posthogLogProcessor],
  });

  sdk.start();
  posthogLogger = logs.getLogger('posthog.contact-api');
  return posthogLogger;
}

export async function flushPostHogLogs(): Promise<void> {
  try {
    await posthogLogProcessor?.forceFlush();
  } catch (error) {
    console.error('PostHog log export error:', error);
  }
}
