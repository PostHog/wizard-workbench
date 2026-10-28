import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

interface PostHogLogRecord {
  severityText: 'INFO' | 'ERROR';
  body: string;
  attributes: Record<string, string>;
}

let posthogLogProvider: LoggerProvider | null = null;

function getPostHogLogProvider(): LoggerProvider | null {
  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken) {
    if (import.meta.env.DEV) {
      throw new Error('PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured');
    }
    return null;
  }

  if (!host) {
    if (import.meta.env.DEV) {
      throw new Error('PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured');
    }
    return null;
  }

  if (!posthogLogProvider) {
    const exporter = new OTLPLogExporter({
      url: `${host}/i/v1/logs`,
      headers: {
        Authorization: `Bearer ${projectToken}`,
      },
    });

    posthogLogProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'astro-hybrid-marketing',
      }),
      processors: [new SimpleLogRecordProcessor(exporter)],
    });
  }

  return posthogLogProvider;
}

export async function emitPostHogLog(record: PostHogLogRecord): Promise<void> {
  const provider = getPostHogLogProvider();
  if (!provider) return;

  try {
    provider.getLogger('posthog-contact-api').emit(record);
    await provider.forceFlush();
  } catch {
    // Log delivery must not change the outcome of the contact request.
  }
}
