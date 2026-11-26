import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs"

let logger: ReturnType<LoggerProvider["getLogger"]> | null | undefined
let loggerProvider: LoggerProvider | undefined

export function getPostHogLogger(): ReturnType<
  LoggerProvider["getLogger"]
> | null {
  if (logger !== undefined) {
    return logger
  }

  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST
  if (!token || !host) {
    const missingVariable = !token
      ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
      : "PUBLIC_POSTHOG_HOST"
    if (dev) {
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }
    logger = null
    return logger
  }

  const exporter = new OTLPLogExporter({
    url: new URL("/i/v1/logs", host).toString(),
    headers: { Authorization: `Bearer ${token}` },
    timeoutMillis: 2000,
  })
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "cmsaas-starter",
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  })
  logger = loggerProvider.getLogger("posthog-integration")

  process.once("beforeExit", () => {
    void loggerProvider?.shutdown().catch(() => {})
  })

  return logger
}

export async function flushPostHogLogs(): Promise<void> {
  await loggerProvider?.forceFlush().catch(() => {})
}
