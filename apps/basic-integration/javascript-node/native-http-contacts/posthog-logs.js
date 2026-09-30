import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (process.env.NODE_ENV !== 'production') {
  if (!projectToken) {
    throw new Error(
      'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'
    );
  }

  if (!host) {
    throw new Error(
      'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
    );
  }
}

export const posthogLogger = logs.getLogger('posthog-integration');

export const posthogLogSdk = projectToken && host
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
  : undefined;

posthogLogSdk?.start();
