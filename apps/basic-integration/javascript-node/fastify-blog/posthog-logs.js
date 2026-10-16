import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const posthogKey = process.env.POSTHOG_KEY;
const posthogHost = process.env.POSTHOG_HOST;

if (!posthogKey && process.env.NODE_ENV !== 'production') {
  console.error(new Error('POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_KEY is configured'));
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
  console.error(new Error('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'));
}

const logSdk = posthogKey && posthogHost
  ? new NodeSDK({
    resource: resourceFromAttributes({ 'service.name': 'fastify-blog' }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(new OTLPLogExporter({
        url: new URL('/i/v1/logs', posthogHost).toString(),
        headers: { Authorization: `Bearer ${posthogKey}` },
      })),
    ],
  })
  : null;

logSdk?.start();

const posthogLog = logSdk ? logs.getLogger('posthog-fastify-blog') : null;

export function logPosthogInfo(body, attributes) {
  posthogLog?.emit({ severityText: 'info', body, attributes });
}

export async function shutdownPosthogLogs() {
  await logSdk?.shutdown();
}
