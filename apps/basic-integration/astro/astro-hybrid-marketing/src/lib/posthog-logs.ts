import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

let logSdk: NodeSDK | null = null;

function getPostHogLogLogger() {
  if (!logSdk) {
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

    logSdk = new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'astro-hybrid-marketing',
      }),
      logRecordProcessors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${host.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
            },
          }),
          { maxExportBatchSize: 1, scheduledDelayMillis: 1000 }
        ),
      ],
    });
    logSdk.start();
  }

  return logs.getLogger('posthog-log-exporter');
}

export function logContactFormOutcome(
  outcome: 'accepted' | 'rejected' | 'failed',
  responseStatus: number
): void {
  const logger = getPostHogLogLogger();
  if (!logger) return;

  logger.emit({
    severityText: outcome === 'failed' ? 'ERROR' : outcome === 'rejected' ? 'WARN' : 'INFO',
    body: 'contact form request completed',
    attributes: {
      event: 'contact_form_request',
      outcome,
      response_status: responseStatus,
    },
  });
}
