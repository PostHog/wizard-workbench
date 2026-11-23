import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs"
import type { Logger } from "@opentelemetry/api-logs"

let logger: Logger | null | undefined
let provider: LoggerProvider | null = null
let missingConfigurationWarningLogged = false

const getPostHogLogger = () => {
  if (logger !== undefined) {
    return logger
  }

  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST
  if (!token || !host) {
    if (dev && !missingConfigurationWarningLogged) {
      const missingVariable = token
        ? "PUBLIC_POSTHOG_HOST"
        : "PUBLIC_POSTHOG_PROJECT_TOKEN"
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
      missingConfigurationWarningLogged = true
    }

    logger = null
    return logger
  }

  provider = new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "cmsaasstarter-server",
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL("/i/v1/logs", host).toString(),
          headers: { Authorization: `Bearer ${token}` },
          timeoutMillis: 2000,
        }),
      }),
    ],
  })

  logger = provider.getLogger("posthog-integration")
  return logger
}

export const logPostHogInfo = async (
  body: string,
  attributes?: Record<string, string | number | boolean>,
) => {
  const posthogLogger = getPostHogLogger()
  posthogLogger?.emit({
    severityText: "info",
    body,
    attributes,
  })

  if (posthogLogger) {
    await provider?.forceFlush().catch(() => {})
  }
}
