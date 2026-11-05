import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const logSdk = projectToken && host
  ? new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(new OTLPLogExporter({
        url: new URL('/i/v1/logs', host).toString(),
        headers: {
          Authorization: `Bearer ${projectToken}`,
        },
      })),
    ],
  })
  : null;

logSdk?.start();

// This named logger is intentionally separate from Fastify's existing Pino logger.
export const posthogLog = logSdk ? logs.getLogger('fastify-blog-posthog') : null;

export async function shutdownPostHogLogs() {
  await logSdk?.shutdown();
}
