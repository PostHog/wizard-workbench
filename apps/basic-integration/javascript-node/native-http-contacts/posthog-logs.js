import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

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

let logSdk = null;

if (!missingVariable) {
  logSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'native-http-contacts',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        })
      ),
    ],
  });

  logSdk.start();
}

export const posthogLogger = missingVariable
  ? null
  : logs.getLogger('posthog-integration');

export async function shutdownPostHogLogs() {
  await logSdk?.shutdown();
}
