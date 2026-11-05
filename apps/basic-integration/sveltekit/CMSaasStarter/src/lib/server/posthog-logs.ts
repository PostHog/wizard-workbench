import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_KEY } from "$env/static/public"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { LoggerProvider, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs"

let loggerProvider: LoggerProvider | null = null

function getLoggerProvider() {
  if (!PUBLIC_POSTHOG_KEY || !PUBLIC_POSTHOG_HOST) {
    if (dev) {
      const missingVariable = !PUBLIC_POSTHOG_KEY
        ? "PUBLIC_POSTHOG_KEY"
        : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return null
  }

  if (!loggerProvider) {
    const exporter = new OTLPLogExporter({
      url: new URL("/i/v1/logs", PUBLIC_POSTHOG_HOST).toString(),
      headers: { Authorization: `Bearer ${PUBLIC_POSTHOG_KEY}` },
    })

    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "cmsaasstarter-server",
        "deployment.environment": dev ? "development" : "production",
      }),
      processors: [new SimpleLogRecordProcessor({ exporter })],
    })
  }

  return loggerProvider
}

export async function logPostHogServerAction(
  body: string,
  attributes?: Record<string, boolean | number | string>,
) {
  const provider = getLoggerProvider()
  if (!provider) return

  // This provider is intentionally private so existing application loggers are not exported.
  provider.getLogger("posthog-exporter").emit({
    body,
    severityText: "info",
    attributes,
  })
  await provider.forceFlush()
}
