import 'dotenv/config';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

const logProvider = apiKey && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'hono-links-api',
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${host.replace(/\/$/, '')}/i/v1/logs`,
            headers: { Authorization: `Bearer ${apiKey}` },
          })
        ),
      ],
    })
  : null;

export const posthogLogger = logProvider?.getLogger('posthog-api-lifecycle') ?? null;
export const shutdownPostHogLogs = () => logProvider?.shutdown();
