import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

export let posthogLog = null;
export let posthogLogsSdk = null;

if (apiKey && host) {
  posthogLogsSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }),
      ),
    ],
  });

  posthogLogsSdk.start();
  posthogLog = logs.getLogger('posthog-integration');
}
