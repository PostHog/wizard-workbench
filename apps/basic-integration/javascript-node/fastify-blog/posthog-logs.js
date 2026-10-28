import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { posthogConfig } from './posthog.js';

let posthogLogsSdk = null;

if (posthogConfig) {
  const { host, projectToken } = posthogConfig;
  const logsEndpoint = new URL('/i/v1/logs', host).toString();

  posthogLogsSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: logsEndpoint,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      ),
    ],
  });
  posthogLogsSdk.start();
}

export const posthogLog = logs.getLogger('fastify-blog.posthog');

export async function shutdownPostHogLogs() {
  await posthogLogsSdk?.shutdown();
}
