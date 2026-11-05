import { logs, type Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

let posthogLogSdk: NodeSDK | null = null;
let posthogLogger: Logger | null = null;

export function getPostHogLogLogger(): Logger | null {
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

  if (!posthogLogger) {
    posthogLogSdk = new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'astro-hybrid-marketing',
      }),
      logRecordProcessors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
            },
          }),
        }),
      ],
    });
    posthogLogSdk.start();
    posthogLogger = logs.getLogger('posthog-contact-api');
  }

  return posthogLogger;
}
