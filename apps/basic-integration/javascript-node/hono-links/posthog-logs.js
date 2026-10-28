import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function missingConfiguration(variableName) {
  if (!isProduction) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }

  return null;
}

const logExporter = !projectToken
  ? missingConfiguration('POSTHOG_PROJECT_TOKEN')
  : !host
    ? missingConfiguration('POSTHOG_HOST')
    : new OTLPLogExporter({
        url: `${host}/i/v1/logs`,
        headers: { Authorization: `Bearer ${projectToken}` },
      });

if (logExporter) {
  const logSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'hono-links-api',
    }),
    logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
  });

  logSdk.start();
}

const posthogLogger = logExporter ? logs.getLogger('posthog-integration') : null;

export function logPostHogEvent(severityText, body, attributes) {
  if (posthogLogger) {
    posthogLogger.emit({ severityText, body, attributes });
  }
}
