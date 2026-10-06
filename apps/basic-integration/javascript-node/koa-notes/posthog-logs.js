import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let logSdk;
let posthogLogger;

if (projectToken && host) {
  logSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes-api',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: { Authorization: `Bearer ${projectToken}` },
        })
      ),
    ],
  });
  logSdk.start();
  posthogLogger = logs.getLogger('koa-notes-posthog');
} else if (process.env.NODE_ENV !== 'production') {
  const missingVariable = projectToken ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export function emitPostHogLog({ severityText, body, attributes }) {
  posthogLogger?.emit({ severityText, body, attributes });
}

export async function shutdownPostHogLogs() {
  await logSdk?.shutdown();
}
