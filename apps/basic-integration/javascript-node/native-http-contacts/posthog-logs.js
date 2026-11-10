import 'dotenv/config';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

function createLogProvider() {
  if (!apiKey || !host) return null;

  try {
    return new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'native-http-contacts',
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: new URL('/i/v1/logs', host).toString(),
            headers: { Authorization: `Bearer ${apiKey}` },
          })
        ),
      ],
    });
  } catch {
    return null;
  }
}

const logProvider = createLogProvider();
const posthogLogger = logProvider?.getLogger('native-http-contacts.posthog');

export function emitPostHogLog(severityText, body) {
  try {
    posthogLogger?.emit({ severityText, body });
  } catch {}
}

export async function shutdownPostHogLogs() {
  try {
    await logProvider?.shutdown();
  } catch {}
}
