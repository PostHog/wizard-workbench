import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;
const missingVariable = !posthogProjectToken
  ? 'POSTHOG_PROJECT_TOKEN'
  : !posthogHost
    ? 'POSTHOG_HOST'
    : null;

if (missingVariable && process.env.NODE_ENV !== 'production') {
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

if (!missingVariable) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes-api',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', posthogHost).toString(),
          headers: {
            Authorization: `Bearer ${posthogProjectToken}`,
          },
        })
      ),
    ],
  });

  sdk.start();
}

export const posthogLogExporter = missingVariable
  ? null
  : logs.getLogger('posthog-log-exporter');
