const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
let logSdk;
let posthogLog;

if (!projectToken || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
} else {
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

  logSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'native-http-contacts',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: { Authorization: `Bearer ${projectToken}` },
        })
      ),
    ],
  });

  await logSdk.start();
  posthogLog = logs.getLogger('posthog-exporter');
}

export async function shutdownPosthogLogs() {
  await logSdk?.shutdown();
}

export default posthogLog;
