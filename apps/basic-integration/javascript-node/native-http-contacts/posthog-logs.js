import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

const loggerProvider = apiKey && host
  ? new LoggerProvider({
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
    })
  : null;

const posthogLogLogger = loggerProvider?.getLogger('posthog-exporter');

export function emitPostHogLog(record) {
  posthogLogLogger?.emit(record);
}
