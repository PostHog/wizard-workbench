import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

let loggerProvider = null;
let posthogLog = null;

if (projectToken && host) {
  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: { Authorization: `Bearer ${projectToken}` },
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'fastify-blog' }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  posthogLog = loggerProvider.getLogger('fastify-blog.posthog');
}

export function emitPostHogLog(record) {
  try {
    posthogLog?.emit(record);
  } catch {
    // Log delivery must not affect the request that produced the record.
  }
}

export async function shutdownPostHogLogs() {
  if (!loggerProvider) return;

  let timeout;
  try {
    await Promise.race([
      loggerProvider.shutdown(),
      new Promise((resolve) => {
        timeout = setTimeout(resolve, 3000);
      }),
    ]);
  } catch {
    // Log delivery must not prevent the server from closing.
  } finally {
    clearTimeout(timeout);
  }
}
