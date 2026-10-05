import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const posthogLogs =
  projectToken && host
    ? new NodeSDK({
        resource: resourceFromAttributes({
          'service.name': 'native-http-contacts',
        }),
        logRecordProcessors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: `${host.replace(/\/$/, '')}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${projectToken}`,
              },
            })
          ),
        ],
      })
    : null;

posthogLogs?.start();

const logger = logs.getLogger('posthog-native-http-contacts');

export function logPostHogRecord(severityText, body, attributes) {
  if (!posthogLogs) return;

  logger.emit({ severityText, body, attributes });
}

export { posthogLogs };
