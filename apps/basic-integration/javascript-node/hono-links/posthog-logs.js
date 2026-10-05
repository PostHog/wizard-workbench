import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if ((!projectToken || !host) && process.env.NODE_ENV !== 'production') {
  const missingVariable = !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

const logProvider = projectToken && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'hono-links',
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${host.replace(/\/$/, '')}/i/v1/logs`,
            headers: { Authorization: `Bearer ${projectToken}` },
          })
        ),
      ],
    })
  : null;

export const posthogLogs = logProvider?.getLogger('posthog-hono-links') ?? null;

export const shutdownPosthogLogs = () => logProvider?.shutdown();
