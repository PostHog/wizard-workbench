import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.PUBLIC_POSTHOG_HOST;
const isDevelopment = import.meta.env.DEV;

if (!projectToken && isDevelopment) {
  console.warn(
    'PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
  );
}

if (!host && isDevelopment) {
  console.warn(
    'PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured',
  );
}

let posthogLogger: ReturnType<LoggerProvider['getLogger']> | undefined;

if (projectToken && host) {
  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-ssr-docs',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      ),
    ],
  });

  posthogLogger = loggerProvider.getLogger('posthog-astro-ssr-docs');

  process.once('beforeExit', () => {
    void loggerProvider.shutdown().catch(() => {});
  });
}

export function logSiteShellRendered(): void {
  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'site_shell_rendered',
    attributes: { render_layer: 'site_shell' },
  });
}

export function logDocumentationLayoutRendered(): void {
  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'documentation_layout_rendered',
    attributes: { render_layer: 'documentation' },
  });
}
