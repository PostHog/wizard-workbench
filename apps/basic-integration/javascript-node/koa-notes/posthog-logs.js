import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if ((!projectToken || !host) && process.env.NODE_ENV !== 'production') {
  const missingVariable = !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

const logsSdk = projectToken && host
  ? new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'koa-notes',
      }),
      logRecordProcessors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: new URL('/i/v1/logs', host).toString(),
            headers: { Authorization: `Bearer ${projectToken}` },
          })
        ),
      ],
    })
  : null;

logsSdk?.start();

const posthogLogger = logs.getLogger('posthog-notes-exporter');

export function logPosthog(severityText, body, attributes = {}) {
  if (!logsSdk) return;

  posthogLogger.emit({ severityText, body, attributes });
}

export async function shutdownPosthogLogs() {
  await logsSdk?.shutdown();
}
