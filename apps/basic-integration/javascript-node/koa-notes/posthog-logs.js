import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

function requirePostHogEnvironment(variable, value) {
  if (!value && process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
    );
  }
}

requirePostHogEnvironment('POSTHOG_API_KEY', apiKey);
requirePostHogEnvironment('POSTHOG_HOST', host);

let posthogLogger = null;

if (apiKey && host) {
  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({ 'service.name': 'koa-notes' }),
    logRecordProcessors: [new BatchLogRecordProcessor(exporter)],
  });

  sdk.start();
  posthogLogger = logs.getLogger('koa-notes-posthog');
}

export function logPostHog(severityText, body, attributes = {}) {
  posthogLogger?.emit({ severityText, body, attributes });
}
