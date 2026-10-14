import { SeverityNumber, type Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import {
  LoggerProvider,
  SimpleLogRecordProcessor
} from '@opentelemetry/sdk-logs';

let posthogLogger: Logger | null = null;
let posthogLoggerProvider: LoggerProvider | null = null;

function getPostHogLogger() {
  if (posthogLogger) {
    return posthogLogger;
  }

  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = token
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }

    return null;
  }

  const exporter = new OTLPLogExporter({
    url: `${host}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  posthogLoggerProvider = new LoggerProvider({
    processors: [new SimpleLogRecordProcessor({ exporter })]
  });
  posthogLogger = posthogLoggerProvider.getLogger('posthog-checkout-logs');

  return posthogLogger;
}

async function emitCheckoutLog(severityNumber: SeverityNumber, body: string) {
  const logger = getPostHogLogger();

  if (!logger || !posthogLoggerProvider) {
    return;
  }

  logger.emit({ severityNumber, body });
  await posthogLoggerProvider.forceFlush().catch(() => undefined);
}

export function logCheckoutCompleted() {
  return emitCheckoutLog(SeverityNumber.INFO, 'checkout_subscription_persisted');
}

export function logCheckoutFailed() {
  return emitCheckoutLog(
    SeverityNumber.ERROR,
    'checkout_subscription_processing_failed'
  );
}
