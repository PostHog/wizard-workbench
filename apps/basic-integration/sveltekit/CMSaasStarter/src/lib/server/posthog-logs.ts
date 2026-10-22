import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { logs } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"

let initialized = false

const posthogLogger = logs.getLogger("posthog-integration")

type PostHogLogAttributes = Record<string, boolean | number | string>

function configurationError(variableName: string) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
  )
}

export function initPostHogLogCapture() {
  if (initialized) return
  initialized = true

  const projectToken = env.PUBLIC_POSTHOG_KEY
  const host = env.PUBLIC_POSTHOG_HOST

  if (!projectToken) {
    if (dev) throw configurationError("PUBLIC_POSTHOG_KEY")
    return
  }

  if (!host) {
    if (dev) throw configurationError("PUBLIC_POSTHOG_HOST")
    return
  }

  let endpoint: string
  try {
    endpoint = new URL("/i/v1/logs", host).toString()
  } catch {
    if (dev) throw configurationError("PUBLIC_POSTHOG_HOST")
    return
  }

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      "service.name": "cmsassstarter",
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: endpoint,
          headers: { Authorization: `Bearer ${projectToken}` },
        }),
      }),
    ],
  })

  sdk.start()
}

export function emitPostHogLog(
  body: string,
  attributes: PostHogLogAttributes,
) {
  posthogLogger.emit({ severityText: "INFO", body, attributes })
}
