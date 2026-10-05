import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

export const posthogLog = logs.getLogger('koa-notes-posthog');

let logSdk;

export function startPostHogLogCapture() {
  if (!apiKey || !host || logSdk) return;

  logSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes-api',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${apiKey}` },
        })
      ),
    ],
  });

  logSdk.start();
}
