import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const shutdownTimeoutMs = 3000;

let loggerProvider;
let posthogLog;

if (projectToken && host) {
  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: { Authorization: `Bearer ${projectToken}` },
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    processors: [
      new BatchLogRecordProcessor(exporter, { exportTimeoutMillis: shutdownTimeoutMs }),
    ],
  });
  posthogLog = loggerProvider.getLogger('fastify-blog-posthog');
}

export function logPosthogInfo(body, attributes) {
  posthogLog?.emit({ severityText: 'info', body, attributes });
}

export async function shutdownPosthogLogs() {
  if (!loggerProvider) return;

  let timeoutId;
  const timeout = new Promise((resolve) => {
    timeoutId = setTimeout(resolve, shutdownTimeoutMs);
  });
  try {
    await Promise.race([loggerProvider.shutdown().catch(() => {}), timeout]);
  } finally {
    clearTimeout(timeoutId);
    loggerProvider = undefined;
    posthogLog = undefined;
  }
}
