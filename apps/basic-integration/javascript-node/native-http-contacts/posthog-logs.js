import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!projectToken && process.env.NODE_ENV !== 'production') {
  throw new Error(
    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'
  );
}

if (!host && process.env.NODE_ENV !== 'production') {
  throw new Error(
    'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
  );
}

const sdk =
  projectToken && host
    ? new NodeSDK({
        resource: resourceFromAttributes({
          'service.name': 'native-http-contacts',
        }),
        logRecordProcessors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: new URL('/i/v1/logs', host).toString(),
              headers: { Authorization: `Bearer ${projectToken}` },
            })
          ),
        ],
      })
    : null;

sdk?.start();

export const posthogLogger = sdk ? logs.getLogger('posthog-native-http-contacts') : null;
export const posthogLogSdk = sdk;
