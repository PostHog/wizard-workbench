import 'server-only';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BatchLogRecordProcessor,
  LoggerProvider
} from '@opentelemetry/sdk-logs';
import { after } from 'next/server';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const logsConfigured = Boolean(posthogKey && posthogHost);

function missingConfigurationWarning(variableName: string) {
  return `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`;
}

if (!logsConfigured && process.env.NODE_ENV !== 'production') {
  console.warn(
    missingConfigurationWarning(
      !posthogKey ? 'NEXT_PUBLIC_POSTHOG_KEY' : 'NEXT_PUBLIC_POSTHOG_HOST'
    )
  );
}

export const posthogLogProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'nextjs-saas',
    'deployment.environment': process.env.NODE_ENV ?? 'development'
  }),
  processors: logsConfigured
    ? [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${posthogHost}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${posthogKey}`,
              'Content-Type': 'application/json'
            }
          })
        )
      ]
    : []
});

const posthogLogExporter = posthogLogProvider.getLogger('posthog-exporter');

type LogAttributes = Record<string, string | number | boolean>;

export function emitPostHogLog(body: string, attributes: LogAttributes) {
  if (!logsConfigured) {
    return;
  }

  posthogLogExporter.emit({
    severityText: 'INFO',
    body,
    attributes
  });

  after(async () => {
    await posthogLogProvider.forceFlush().catch(() => {});
  });
}
