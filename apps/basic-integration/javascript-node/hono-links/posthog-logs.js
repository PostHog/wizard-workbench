import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

export const posthogLog = apiKey && host
  ? (() => {
      const sdk = new NodeSDK({
        resource: resourceFromAttributes({
          'service.name': 'hono-links-api',
        }),
        logRecordProcessors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: `${host.replace(/\/$/, '')}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            })
          ),
        ],
      });

      sdk.start();
      return logs.getLogger('posthog-links-integration');
    })()
  : null;
