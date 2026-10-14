import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { SeverityNumber } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { LoggerProvider, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs"

let loggerProvider: LoggerProvider | undefined

function getPostHogLogger() {
  if (loggerProvider) {
    return loggerProvider.getLogger("posthog-checkout-logs")
  }

  const projectToken = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (dev) {
      const missingVariable = !projectToken
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return undefined
  }

  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, "")}/i/v1/logs`,
    headers: {
      Authorization: `Basic ${Buffer.from(`${projectToken}:`).toString("base64")}`,
    },
  })

  loggerProvider = new LoggerProvider({
    processors: [new SimpleLogRecordProcessor({ exporter })],
  })

  return loggerProvider.getLogger("posthog-checkout-logs")
}

export function logCheckoutSessionRequested(planId: string) {
  getPostHogLogger()?.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: "INFO",
    body: "checkout_session_requested",
    attributes: { plan_id: planId },
  })
}

export function logCheckoutSessionCreated(planId: string) {
  getPostHogLogger()?.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: "INFO",
    body: "checkout_session_created",
    attributes: { plan_id: planId },
  })
}

export function logCheckoutSessionCreationFailed() {
  getPostHogLogger()?.emit({
    severityNumber: SeverityNumber.ERROR,
    severityText: "ERROR",
    body: "checkout_session_creation_failed",
  })
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush()
}
