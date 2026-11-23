import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const isConfigured = Boolean(projectToken && posthogHost);

if (!isConfigured && process.env.NODE_ENV !== 'production') {
  const missingVariable = projectToken
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

const exporter = isConfigured
  ? new OTLPLogExporter({
      url: `${posthogHost!.replace(/\/$/, '')}/i/v1/logs`,
      headers: {
        Authorization: `Bearer ${projectToken}`,
        'Content-Type': 'application/json',
      },
      timeoutMillis: 2000,
    })
  : undefined;

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'nextjs-saas',
  }),
  processors: exporter
    ? [new BatchLogRecordProcessor({ exporter })]
    : [],
});

export const posthogLogger = loggerProvider.getLogger('posthog-checkout-lifecycle');

export function register() {}
