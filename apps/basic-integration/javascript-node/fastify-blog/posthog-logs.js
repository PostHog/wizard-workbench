import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const missingConfiguration = !projectToken
  ? 'POSTHOG_PROJECT_TOKEN'
  : !host
    ? 'POSTHOG_HOST'
    : null;

if (missingConfiguration && process.env.NODE_ENV !== 'production') {
  throw new Error(
    `${missingConfiguration} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingConfiguration} is configured`,
  );
}

const logSdk = missingConfiguration
  ? null
  : new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'fastify-blog',
      }),
      logRecordProcessors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${host.replace(/\/$/, '')}/i/v1/logs`,
            headers: { Authorization: `Bearer ${projectToken}` },
          }),
        ),
      ],
    });

logSdk?.start();

const posthogLogger = logSdk ? logs.getLogger('fastify-blog.posthog') : null;

export function emitPosthogLog(severityText, body, attributes = {}) {
  posthogLogger?.emit({ severityText, body, attributes });
}

export async function shutdownPosthogLogs() {
  await logSdk?.shutdown();
}
