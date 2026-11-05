import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const missingVariable = !projectToken
  ? 'POSTHOG_PROJECT_TOKEN'
  : !host
    ? 'POSTHOG_HOST'
    : null;

if (missingVariable && process.env.NODE_ENV !== 'production') {
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

let sdk;

if (projectToken && host) {
  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: { Authorization: `Bearer ${projectToken}` },
        })
      ),
    ],
  });

  sdk.start();
}

export const posthogLog = logs.getLogger('koa-notes-posthog');

export async function shutdownPostHogLogs() {
  await sdk?.shutdown();
}
