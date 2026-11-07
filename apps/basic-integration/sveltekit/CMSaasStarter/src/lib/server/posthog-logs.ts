import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_KEY } from "$env/static/public"
import type { Logger } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs"

let posthogLogger: Logger | null | undefined

function getPostHogLogger() {
  if (posthogLogger !== undefined) {
    return posthogLogger
  }

  if (!PUBLIC_POSTHOG_KEY) {
    if (dev) {
      console.warn(
        "PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured",
      )
    }
    posthogLogger = null
    return posthogLogger
  }

  if (!PUBLIC_POSTHOG_HOST) {
    if (dev) {
      console.warn(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    posthogLogger = null
    return posthogLogger
  }

  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "cmsaasstarter",
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${PUBLIC_POSTHOG_HOST}/i/v1/logs`,
          headers: { Authorization: `Bearer ${PUBLIC_POSTHOG_KEY}` },
        }),
      }),
    ],
  })

  posthogLogger = loggerProvider.getLogger("cmsaasstarter.posthog")
  return posthogLogger
}

export function logServerActionCompleted({
  action,
  isAuthenticated,
}: {
  action: string
  isAuthenticated: boolean
}) {
  getPostHogLogger()?.emit({
    severityText: "INFO",
    body: "Server action completed",
    attributes: {
      action,
      is_authenticated: isAuthenticated,
      outcome: "success",
    },
  })
}
