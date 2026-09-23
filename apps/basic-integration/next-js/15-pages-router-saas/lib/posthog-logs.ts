import 'server-only';

import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

type LogAttributes = Record<string, string | number | boolean>;

let loggerProvider: LoggerProvider | null | undefined;

function getPostHogLoggerProvider() {
  if (loggerProvider !== undefined) {
    return loggerProvider;
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!apiKey || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = apiKey
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_KEY';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }

    loggerProvider = null;
    return loggerProvider;
  }

  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  loggerProvider = new LoggerProvider({
    processors: [new SimpleLogRecordProcessor({ exporter })]
  });
  return loggerProvider;
}

export async function exportPostHogLog(
  body: string,
  attributes?: LogAttributes
) {
  const provider = getPostHogLoggerProvider();

  if (!provider) {
    return;
  }

  provider.getLogger('posthog-integration').emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body,
    attributes
  });
  await provider.forceFlush();
}
