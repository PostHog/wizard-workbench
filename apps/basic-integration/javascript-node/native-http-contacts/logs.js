import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function requirePostHogConfig(value, variableName) {
  if (!value && !isProduction) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

requirePostHogConfig(apiKey, 'POSTHOG_API_KEY');
requirePostHogConfig(host, 'POSTHOG_HOST');

export const posthogLogProvider =
  apiKey && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'native-http-contacts',
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: new URL('/i/v1/logs', host).toString(),
              headers: { Authorization: `Bearer ${apiKey}` },
            })
          ),
        ],
      })
    : undefined;

export const posthogLogger = posthogLogProvider?.getLogger('posthog-integration');
