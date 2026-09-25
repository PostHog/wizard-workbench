import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
let logsSdk;

if (projectToken && host) {
  const logsEndpoint = new URL('/i/v1/logs', host).toString();

  logsSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes-api',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: logsEndpoint,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      }),
    ],
  });

  logsSdk.start();
}

export const posthogLogger = logs.getLogger('koa-notes-posthog');

export async function shutdownPosthogLogs() {
  await logsSdk?.shutdown();
}
