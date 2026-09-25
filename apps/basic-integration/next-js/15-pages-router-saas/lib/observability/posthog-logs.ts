import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

let loggerProvider: LoggerProvider | null | undefined;

function getLoggerProvider() {
  if (loggerProvider !== undefined) {
    return loggerProvider;
  }

  const projectKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectKey || !host) {
    const missingVariable = !projectKey
      ? 'NEXT_PUBLIC_POSTHOG_KEY'
      : 'NEXT_PUBLIC_POSTHOG_HOST';

    if (process.env.NODE_ENV === 'development') {
      console.error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    loggerProvider = null;
    return loggerProvider;
  }

  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${projectKey}`
    }
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'next-pages-router-saas'
    }),
    processors: [new SimpleLogRecordProcessor({ exporter })]
  });

  return loggerProvider;
}

export async function posthogLog(
  message: string,
  attributes: Record<string, string | boolean | number>
) {
  const provider = getLoggerProvider();

  if (!provider) {
    return;
  }

  provider.getLogger('posthog-integration').emit({
    body: message,
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    attributes
  });

  try {
    await provider.forceFlush();
  } catch {
    console.error('PostHog log export failed');
  }
}
