import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const configured = Boolean(projectToken && host);

if (!configured && process.env.NODE_ENV !== 'production') {
  const missingVariable = projectToken ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

let posthogLogSdk = null;
let posthogLogger = null;

if (configured) {
  const logsUrl = new URL('i/v1/logs', `${host.replace(/\/$/, '')}/`).toString();
  posthogLogSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: logsUrl,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      ),
    ],
  });
  posthogLogSdk.start();
  posthogLogger = logs.getLogger('posthog-integration');
}

export { posthogLogger };

export async function shutdownPosthogLogs() {
  await posthogLogSdk?.shutdown();
}
