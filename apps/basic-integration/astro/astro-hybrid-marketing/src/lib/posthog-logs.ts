import { logs, type Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

let logger: Logger | null | undefined;
let logSdk: NodeSDK | null = null;

function getPostHogLogger(): Logger | null {
  if (logger !== undefined) return logger;

  const projectToken = import.meta.env.PUBLIC_POSTHOG_KEY;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (import.meta.env.DEV) {
      if (!projectToken) {
        console.error(
          'PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured'
        );
      }
      if (!host) {
        console.error(
          'PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured'
        );
      }
    }

    logger = null;
    return logger;
  }

  try {
    logSdk = new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'astro-hybrid-marketing',
      }),
      logRecordProcessors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: new URL('/i/v1/logs', host).toString(),
            headers: {
              Authorization: `Bearer ${projectToken}`,
            },
          })
        ),
      ],
    });
    logSdk.start();
    logger = logs.getLogger('posthog-contact-api');
  } catch (error) {
    logger = null;
    if (import.meta.env.DEV) {
      console.error('PostHog log exporter could not be initialized', error);
    }
  }

  return logger;
}

async function emitContactLog(
  severityText: 'INFO' | 'ERROR',
  body: 'contact_submission_accepted' | 'contact_submission_failed'
): Promise<void> {
  const contactLogger = getPostHogLogger();
  if (!contactLogger) return;

  contactLogger.emit({
    severityText,
    body,
    attributes: {
      route: '/api/contact',
    },
  });

  try {
    await logSdk?.forceFlush();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('PostHog log export failed', error);
    }
  }
}

export function logContactSubmissionAccepted(): Promise<void> {
  return emitContactLog('INFO', 'contact_submission_accepted');
}

export function logContactSubmissionFailed(): Promise<void> {
  return emitContactLog('ERROR', 'contact_submission_failed');
}
