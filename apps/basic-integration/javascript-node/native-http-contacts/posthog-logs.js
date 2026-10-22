const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

export let posthogLogger = null;

export async function initializePostHogLogs() {
  if (!apiKey || !host) return;

  const [
    { logs },
    { OTLPLogExporter },
    { resourceFromAttributes },
    { BatchLogRecordProcessor },
    { NodeSDK },
  ] = await Promise.all([
    import('@opentelemetry/api-logs'),
    import('@opentelemetry/exporter-logs-otlp-http'),
    import('@opentelemetry/resources'),
    import('@opentelemetry/sdk-logs'),
    import('@opentelemetry/sdk-node'),
  ]);

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'native-http-contacts',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
      ),
    ],
  });

  sdk.start();
  posthogLogger = logs.getLogger('posthog-exporter');
}
