import { dev } from "$app/environment"
import {
  PUBLIC_POSTHOG_HOST,
  PUBLIC_POSTHOG_PROJECT_TOKEN,
} from "$env/static/public"
import { logs, type Logger } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"

let posthogLogSdk: NodeSDK | null = null
let posthogLogProcessor: BatchLogRecordProcessor | null = null
let posthogLogger: Logger | null = null

type LogAttributes = Record<string, boolean | number | string>

function getPostHogLogger() {
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

  if (!posthogLogger) {
    posthogLogProcessor = new BatchLogRecordProcessor({
      exporter: new OTLPLogExporter({
        url: new URL("/i/v1/logs", PUBLIC_POSTHOG_HOST).toString(),
        headers: {
          Authorization: `Bearer ${PUBLIC_POSTHOG_PROJECT_TOKEN}`,
        },
      }),
    })
    posthogLogSdk = new NodeSDK({
      resource: resourceFromAttributes({
        "service.name": "cmsaasstarter",
      }),
      logRecordProcessors: [posthogLogProcessor],
    })
    posthogLogSdk.start()
    posthogLogger = logs.getLogger("cmsaasstarter.posthog")
  }

  return posthogLogger
}

export async function logPostHogLifecycle(
  message: string,
  attributes: LogAttributes,
) {
  const logger = getPostHogLogger()
  logger?.emit({
    severityText: "INFO",
    body: message,
    attributes,
  })
  if (logger) {
    await posthogLogProcessor?.forceFlush()
  }
}
