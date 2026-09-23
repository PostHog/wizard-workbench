import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import type { Logger } from "@opentelemetry/api-logs"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"

let provider: LoggerProvider | undefined
let logger: Logger | undefined

function getPostHogLogger() {
  if (!PUBLIC_POSTHOG_PROJECT_TOKEN) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return
  }

  if (!PUBLIC_POSTHOG_HOST) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return
  }

  if (!provider) {
    provider = new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "cm-saas-starter-server",
        "deployment.environment": dev ? "development" : "production",
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL("/i/v1/logs", PUBLIC_POSTHOG_HOST).toString(),
            headers: {
              Authorization: `Bearer ${PUBLIC_POSTHOG_PROJECT_TOKEN}`,
            },
          }),
        }),
      ],
    })
    logger = provider.getLogger("posthog_exporter")
  }

  return logger
}

export async function capturePostHogServerLog(
  body: string,
  attributes: Record<string, string | number | boolean>,
) {
  const posthogLogger = getPostHogLogger()
  if (!posthogLogger || !provider) return

  posthogLogger.emit({ severityText: "INFO", body, attributes })
  await provider.forceFlush()
}
