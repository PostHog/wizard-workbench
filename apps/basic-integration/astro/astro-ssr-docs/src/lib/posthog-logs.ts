import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.PUBLIC_POSTHOG_HOST;

let posthogLogger: ReturnType<LoggerProvider['getLogger']> | null = null;

if (token && host) {
  const provider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-ssr-docs',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ),
    ],
  });

  posthogLogger = provider.getLogger('posthog-astro-render-logs');
} else if (import.meta.env.DEV) {
  const missingConfig = !token
    ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
    : 'PUBLIC_POSTHOG_HOST';

  console.warn(
    `${missingConfig} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingConfig} is configured`,
  );
}

export function logPageRender(
  outcome: 'completed' | 'failed',
  pageType: 'documentation' | 'home',
): void {
  posthogLogger?.emit({
    severityText: outcome === 'completed' ? 'info' : 'error',
    body: `server_page_render_${outcome}`,
    attributes: {
      page_type: pageType,
    },
  });
}
