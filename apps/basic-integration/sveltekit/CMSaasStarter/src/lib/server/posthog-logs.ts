import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import { logs } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { LoggerProvider, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs"

let loggerProvider: LoggerProvider | null = null

function getLoggerProvider() {
  if (!PUBLIC_POSTHOG_PROJECT_TOKEN) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return null
  }

  if (!PUBLIC_POSTHOG_HOST) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return null
  }

  if (!loggerProvider) {
    const exporter = new OTLPLogExporter({
      url: new URL("/i/v1/logs", PUBLIC_POSTHOG_HOST).toString(),
      headers: {
        Authorization: `Bearer ${PUBLIC_POSTHOG_PROJECT_TOKEN}`,
      },
    })

    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "cmsaasstarter-server",
        "deployment.environment": dev ? "development" : "production",
      }),
      processors: [new SimpleLogRecordProcessor({ exporter })],
    })
    logs.setGlobalLoggerProvider(loggerProvider)
  }

  return loggerProvider
}

export function configurePostHogServerLogs() {
  getLoggerProvider()
}

export async function capturePostHogServerLog(
  body: string,
  attributes: Record<string, string | number | boolean>,
) {
  const provider = getLoggerProvider()
  if (!provider) return

  logs.getLogger("cmsaasstarter-posthog-exporter").emit({
    severityText: "INFO",
    body,
    attributes,
  })
  await provider.forceFlush()
}
