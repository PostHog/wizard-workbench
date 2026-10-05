import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

let logSdkStarted = false;
let missingConfigurationReported = false;

function reportMissingConfiguration(variableName: string): void {
  if (import.meta.env.DEV && !missingConfigurationReported) {
    missingConfigurationReported = true;
    console.error(
      new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      ),
    );
  }
}

export function getPostHogLogLogger() {
  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken) {
    reportMissingConfiguration('PUBLIC_POSTHOG_PROJECT_TOKEN');
    return undefined;
  }

  if (!host) {
    reportMissingConfiguration('PUBLIC_POSTHOG_HOST');
    return undefined;
  }

  if (!logSdkStarted) {
    const sdk = new NodeSDK({
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

    sdk.start();
    logSdkStarted = true;
  }

  return logs.getLogger('astro-hybrid-marketing.posthog');
}
