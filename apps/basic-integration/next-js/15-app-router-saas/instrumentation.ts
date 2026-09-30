import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogKey && process.env.NODE_ENV !== 'production') {
  throw new Error(
    'NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured'
  );
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
  throw new Error(
    'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
  );
}

const logExporter =
  posthogKey && posthogHost
    ? new OTLPLogExporter({
        url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
        headers: {
          Authorization: `Bearer ${posthogKey}`,
          'Content-Type': 'application/json'
        }
      })
    : undefined;

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ 'service.name': 'next-js-saas' }),
  processors: logExporter
    ? [new BatchLogRecordProcessor({ exporter: logExporter })]
    : []
});

