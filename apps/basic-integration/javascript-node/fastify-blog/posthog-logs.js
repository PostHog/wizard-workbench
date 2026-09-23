import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!projectToken || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
}

const logSdk = projectToken && host
  ? new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
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
  })
  : null;

logSdk?.start();

export const posthogLogger = logSdk ? logs.getLogger('fastify-blog-posthog') : null;
