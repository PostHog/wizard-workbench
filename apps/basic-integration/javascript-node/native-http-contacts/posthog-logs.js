import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;
let logsSdk = null;
let posthogLogger = null;

if (apiKey && host) {
  logsSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'native-http-contacts',
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

  logsSdk.start();
  posthogLogger = logs.getLogger('native-http-contacts.posthog');
}

function shutdownPostHogLogs() {
  return logsSdk?.shutdown();
}

export { posthogLogger, shutdownPostHogLogs };
