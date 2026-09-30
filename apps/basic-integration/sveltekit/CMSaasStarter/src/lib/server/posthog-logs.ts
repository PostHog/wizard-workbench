import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"

let logProvider: LoggerProvider | null = null

function getPostHogLogProvider() {
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

  if (!logProvider) {
    logProvider = new LoggerProvider({
      resource: resourceFromAttributes({ "service.name": "cmsassstarter" }),
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
  }

  return logProvider
}

export async function logPostHogIntegration(
  body: string,
  attributes: Record<string, string | number | boolean> = {},
) {
  const provider = getPostHogLogProvider()
  if (!provider) return

  provider.getLogger("posthog-integration").emit({
    severityText: "info",
    body,
    attributes,
  })
  await provider.forceFlush()
}
