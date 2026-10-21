import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function missingConfiguration(variableName) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

if (!projectToken) missingConfiguration('POSTHOG_PROJECT_TOKEN');
if (!host) missingConfiguration('POSTHOG_HOST');

const logsSdk =
  projectToken && host
    ? new NodeSDK({
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
      })
    : null;

logsSdk?.start();

export const posthogLogger = logsSdk ? logs.getLogger('posthog-contacts-api') : null;

export function shutdownPostHogLogs() {
  return logsSdk?.shutdown();
}
