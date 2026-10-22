import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

function getPostHogLogsConfig() {
  const token = process.env.POSTHOG_PROJECT_TOKEN;
  const host = process.env.POSTHOG_HOST;

  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'
      );
    }
    return null;
  }

  if (!host) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
      );
    }
    return null;
  }

  return { token, host };
}

const config = getPostHogLogsConfig();
let posthogLogger = null;
let posthogLogsSdk = null;

if (config) {
  posthogLogsSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${config.host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${config.token}`,
          },
        }),
      }),
    ],
  });

  posthogLogsSdk.start();
  posthogLogger = logs.getLogger('koa-notes-posthog-logs');
}

export function emitPostHogLog(severityText, body, attributes = {}) {
  posthogLogger?.emit({ severityText, body, attributes });
}

export async function shutdownPostHogLogs() {
  await posthogLogsSdk?.shutdown();
}
