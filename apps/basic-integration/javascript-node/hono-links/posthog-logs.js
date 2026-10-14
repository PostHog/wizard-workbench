import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

if (!apiKey || !host) {
  const missingVariable = !apiKey ? 'POSTHOG_API_KEY' : 'POSTHOG_HOST';

  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
}

const loggerProvider = apiKey && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'hono-links-api',
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${host.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          })
        ),
      ],
    })
  : null;

export const posthogLog = loggerProvider
  ? loggerProvider.getLogger('posthog-links-api')
  : null;
