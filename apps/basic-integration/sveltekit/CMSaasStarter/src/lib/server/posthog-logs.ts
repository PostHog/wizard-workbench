import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_KEY } from "$env/static/public"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs"

const hasPostHogLogsConfiguration = Boolean(
  PUBLIC_POSTHOG_KEY && PUBLIC_POSTHOG_HOST,
)

if (dev && !PUBLIC_POSTHOG_KEY) {
  console.warn(
    "PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured",
  )
}

if (dev && !PUBLIC_POSTHOG_HOST) {
  console.warn(
    "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
  )
}

const loggerProvider = hasPostHogLogsConfiguration
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "cmsassstarter",
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL("/i/v1/logs", PUBLIC_POSTHOG_HOST).toString(),
            headers: {
              Authorization: `Bearer ${PUBLIC_POSTHOG_KEY}`,
            },
          }),
        }),
      ],
    })
  : null

const posthogLogger = loggerProvider?.getLogger("posthog-exporter")

type LogAttributes = Record<string, boolean | number | string>

export function logPostHogInfo(body: string, attributes: LogAttributes = {}) {
  posthogLogger?.emit({
    severityText: "info",
    body,
    attributes,
  })
}
