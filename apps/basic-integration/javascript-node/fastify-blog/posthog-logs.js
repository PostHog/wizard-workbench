import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let logSdk = null;
export let posthogLog = null;

if (projectToken && host) {
  const logEndpoint = `${host.replace(/\/$/, '')}/i/v1/logs`;

  logSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(new OTLPLogExporter({
        url: logEndpoint,
        headers: {
          Authorization: `Bearer ${projectToken}`,
        },
      })),
    ],
  });

  logSdk.start();
  posthogLog = logs.getLogger('fastify-blog-posthog');
}

export async function shutdownPostHogLogs() {
  await logSdk?.shutdown();
}
