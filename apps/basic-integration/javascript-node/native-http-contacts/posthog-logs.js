import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let logger = null;
let sdk = null;

if (projectToken && host) {
  const logsEndpoint = new URL('i/v1/logs', `${host}/`).toString();
  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'native-http-contacts',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: logsEndpoint,
          headers: { Authorization: `Bearer ${projectToken}` },
        })
      ),
    ],
  });

  sdk.start();
  logger = logs.getLogger('posthog-contacts-api');
}

export function logContactsApi(severityText, body, attributes = {}) {
  logger?.emit({ severityText, body, attributes });
}

export async function shutdownPostHogLogs() {
  await sdk?.shutdown();
}
