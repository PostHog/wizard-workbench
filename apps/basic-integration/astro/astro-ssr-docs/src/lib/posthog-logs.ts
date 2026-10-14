import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.PUBLIC_POSTHOG_HOST;
const isDevelopment = import.meta.env.DEV;

let posthogLogger: ReturnType<LoggerProvider['getLogger']> | null = null;

if (!projectToken || !posthogHost) {
  if (isDevelopment) {
    const missingVariable = projectToken
      ? 'PUBLIC_POSTHOG_HOST'
      : 'PUBLIC_POSTHOG_PROJECT_TOKEN';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', posthogHost).toString(),
    headers: {
      Authorization: `Bearer ${projectToken}`,
    },
  });
  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'neuralflow-documentation',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });

  // This provider is intentionally not registered globally, so only this
  // integration's dedicated logger can export records to PostHog.
  posthogLogger = loggerProvider.getLogger('posthog-astro-documentation');
}

function emitInfo(body: string, route: string): void {
  posthogLogger?.emit({
    severityText: 'info',
    body,
    attributes: { route },
  });
}

export function logPageRendered(route: string): void {
  emitInfo('Documentation page rendered', route);
}

export function logHomePageRendered(): void {
  emitInfo('Documentation home page rendered', '/');
}

export function logDocumentationArticleRendered(route: string): void {
  emitInfo('Documentation article rendered', route);
}
