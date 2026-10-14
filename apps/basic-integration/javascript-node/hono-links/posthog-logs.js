import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

export const posthogLogger = logs.getLogger('posthog-exporter');

export const posthogLogSdk = projectToken && host
  ? new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'hono-links-api',
      }),
      logRecordProcessors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${host.replace(/\/$/, '')}/i/v1/logs`,
            headers: { Authorization: `Bearer ${projectToken}` },
          })
        ),
      ],
    })
  : null;

posthogLogSdk?.start();
