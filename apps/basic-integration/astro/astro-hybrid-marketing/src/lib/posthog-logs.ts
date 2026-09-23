import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

let loggerProvider: LoggerProvider | null = null;

function getPostHogLogsConfiguration() {
  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = !projectToken
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }

    return null;
  }

  return { projectToken, host };
}

/**
 * Returns the dedicated logger used only for logs introduced by this integration.
 * It intentionally does not register a global OpenTelemetry logger provider, so
 * existing application and dependency logs remain on their current outputs.
 */
export function getPostHogLogger() {
  const configuration = getPostHogLogsConfiguration();
  if (!configuration) return null;

  if (!loggerProvider) {
    const exporter = new OTLPLogExporter({
      url: new URL('/i/v1/logs', configuration.host).toString(),
      headers: {
        Authorization: `Bearer ${configuration.projectToken}`,
      },
    });

    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'astro-hybrid-marketing',
      }),
      processors: [new SimpleLogRecordProcessor(exporter)],
    });
  }

  return loggerProvider.getLogger('posthog-contact-route');
}

export async function flushPostHogLogs(): Promise<void> {
  try {
    await loggerProvider?.forceFlush();
  } catch (error) {
    console.error('PostHog log flush failed:', error);
  }
}
