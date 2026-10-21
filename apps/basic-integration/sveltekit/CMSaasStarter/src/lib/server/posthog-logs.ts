import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { Logger } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"

let loggerProvider: LoggerProvider | null | undefined
let logProcessor: BatchLogRecordProcessor | null = null

function getPostHogLogger(): Logger | null {
  if (loggerProvider !== undefined) {
    return loggerProvider?.getLogger("posthog-exporter") ?? null
  }

  if (!env.PUBLIC_POSTHOG_PROJECT_TOKEN || !env.PUBLIC_POSTHOG_HOST) {
    if (dev) {
      const missingVariable = !env.PUBLIC_POSTHOG_PROJECT_TOKEN
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    loggerProvider = null
    return null
  }

  logProcessor = new BatchLogRecordProcessor({
    exporter: new OTLPLogExporter({
      url: `${env.PUBLIC_POSTHOG_HOST}/i/v1/logs`,
      headers: {
        Authorization: `Bearer ${env.PUBLIC_POSTHOG_PROJECT_TOKEN}`,
      },
    }),
  })
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "cmsaas-starter",
    }),
    processors: [logProcessor],
  })

  return loggerProvider.getLogger("posthog-exporter")
}

export async function capturePostHogLog(
  message: string,
  action: "billing_portal_opened" | "checkout_started" | "profile_saved",
) {
  const logger = getPostHogLogger()
  if (!logger) return

  logger.emit({
    severityText: "INFO",
    body: message,
    attributes: { action },
  })
  await logProcessor?.forceFlush()
}
