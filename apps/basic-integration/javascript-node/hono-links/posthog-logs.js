import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function missingConfiguration(variableName) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
  );
}

if (process.env.NODE_ENV !== 'production') {
  if (!projectToken) throw missingConfiguration('POSTHOG_PROJECT_TOKEN');
  if (!host) throw missingConfiguration('POSTHOG_HOST');
}

const posthogLogsSdk = projectToken && host
  ? new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'hono-links-api',
      }),
      logRecordProcessors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${host.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
            },
          })
        ),
      ],
    })
  : null;

posthogLogsSdk?.start();

export const posthogLogger = posthogLogsSdk
  ? logs.getLogger('hono-links-posthog-exporter')
  : null;
