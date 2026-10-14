import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const logsEndpoint = host ? new URL('i/v1/logs', `${host}/`).toString() : null;

const logsSdk = token && logsEndpoint
  ? new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'fastify-blog',
      }),
      logRecordProcessors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: logsEndpoint,
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      ],
    })
  : null;

logsSdk?.start();

export const posthogLog = logsSdk ? logs.getLogger('fastify-blog-posthog') : null;

export async function shutdownPostHogLogs() {
  await logsSdk?.shutdown();
}
