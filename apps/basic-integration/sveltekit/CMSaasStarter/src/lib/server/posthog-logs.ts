import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"

let contactWorkflowLogger: ReturnType<LoggerProvider["getLogger"]> | null = null
let contactWorkflowProvider: LoggerProvider | null = null

const posthogKey = env.PUBLIC_POSTHOG_KEY
const posthogHost = env.PUBLIC_POSTHOG_HOST

if (!posthogKey || !posthogHost) {
  if (dev) {
    const missingVariable = posthogKey
      ? "PUBLIC_POSTHOG_HOST"
      : "PUBLIC_POSTHOG_KEY"
    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    )
  }
} else {
  try {
    const provider = new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "cmsassstarter",
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL("/i/v1/logs", posthogHost).toString(),
            headers: { Authorization: `Bearer ${posthogKey}` },
            timeoutMillis: 2000,
          }),
        }),
      ],
    })

    contactWorkflowProvider = provider
    contactWorkflowLogger = provider.getLogger("posthog-contact-workflow")
  } catch {
    if (dev) {
      console.warn(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
  }
}

export function logContactWorkflow(message: string, stage: string) {
  contactWorkflowLogger?.emit({
    severityText: "INFO",
    body: message,
    attributes: { stage },
  })
}

export async function flushContactWorkflowLogs() {
  await contactWorkflowProvider?.forceFlush().catch(() => {})
}
