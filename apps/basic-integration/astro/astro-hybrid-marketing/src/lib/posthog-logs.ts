import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

interface PostHogLogCapture {
  error(message: string): void;
  info(message: string): void;
  flush(): Promise<void>;
}

let posthogLogCapture: PostHogLogCapture | null | undefined;

export function getPostHogLogCapture(): PostHogLogCapture | null {
  if (posthogLogCapture !== undefined) {
    return posthogLogCapture;
  }

  const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    const missingVariable = !token
      ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
      : 'PUBLIC_POSTHOG_HOST';

    if (import.meta.env.DEV) {
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    posthogLogCapture = null;
    return posthogLogCapture;
  }

  const provider = new LoggerProvider({
    processors: [
      new SimpleLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: { Authorization: `Bearer ${token}` },
        }),
      ),
    ],
  });
  const logger = provider.getLogger('posthog-contact-api');

  posthogLogCapture = {
    info(message) {
      logger.emit({ body: message, severityNumber: SeverityNumber.INFO, severityText: 'INFO' });
    },
    error(message) {
      logger.emit({ body: message, severityNumber: SeverityNumber.ERROR, severityText: 'ERROR' });
    },
    async flush() {
      await provider.forceFlush().catch(() => undefined);
    },
  };

  return posthogLogCapture;
}
