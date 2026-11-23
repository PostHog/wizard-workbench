import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"
import type { Logger } from "@opentelemetry/api-logs"

let logger: Logger | null | undefined

const missingConfigurationWarning = (variableName: string) =>
  `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`

export function getPostHogLogLogger(): Logger | null {
  if (logger !== undefined) {
    return logger
  }

  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST
  if (!token || !host) {
    if (dev) {
      console.warn(
        missingConfigurationWarning(
          token ? "PUBLIC_POSTHOG_HOST" : "PUBLIC_POSTHOG_PROJECT_TOKEN",
        ),
      )
    }
    logger = null
    return logger
  }

  const provider = new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "cmsaasstarter-web",
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, "")}/i/v1/logs`,
          headers: { authorization: `Bearer ${token}` },
        }),
      }),
    ],
  })

  logger = provider.getLogger("posthog-integration")

  return logger
}

export function logContactRequestStored() {
  getPostHogLogLogger()?.emit({
    severityText: "INFO",
    body: "contact_request_stored",
  })
}

export function logProfileSaved() {
  getPostHogLogLogger()?.emit({
    severityText: "INFO",
    body: "profile_saved",
  })
}

export function logSubscriptionCheckoutCreated() {
  getPostHogLogLogger()?.emit({
    severityText: "INFO",
    body: "subscription_checkout_created",
    attributes: { payment_provider: "stripe" },
  })
}
