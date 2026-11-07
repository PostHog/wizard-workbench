import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let loggerProvider = null;

export const posthogLogger =
  projectToken && host
    ? (() => {
        loggerProvider = new LoggerProvider({
          resource: resourceFromAttributes({
            'service.name': 'koa-notes',
            'deployment.environment': process.env.NODE_ENV || 'development',
          }),
        });
        loggerProvider.addLogRecordProcessor(
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: `${host.replace(/\/$/, '')}/i/v1/logs`,
              headers: { Authorization: `Bearer ${projectToken}` },
            })
          )
        );
        return loggerProvider.getLogger('koa-notes-posthog');
      })()
    : null;

export function shutdownPosthogLogs() {
  return loggerProvider ? loggerProvider.shutdown() : Promise.resolve();
}
