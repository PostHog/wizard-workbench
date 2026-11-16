import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let loggerProvider = null;
let posthogLogger = null;

if (token && host) {
  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: { Authorization: `Bearer ${token}` },
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes-api',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  posthogLogger = loggerProvider.getLogger('koa-notes-posthog');
}

export function logMutation(operation, attributes) {
  try {
    posthogLogger?.emit({
      severityText: 'INFO',
      body: 'notes_api_mutation_completed',
      attributes: { operation, ...attributes },
    });
  } catch {}
}

export async function shutdownPostHogLogs() {
  await loggerProvider?.shutdown().catch(() => {});
}
