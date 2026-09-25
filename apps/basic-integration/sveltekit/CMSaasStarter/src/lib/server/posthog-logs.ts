import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { LoggerProvider, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs"

const projectToken = env.PUBLIC_POSTHOG_PROJECT_TOKEN
const host = env.PUBLIC_POSTHOG_HOST

function getPostHogLogger() {
  if (!projectToken || projectToken === "your_posthog_project_token_here") {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return null
  }

  if (!host) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return null
  }

  const exporter = new OTLPLogExporter({
    url: new URL("/i/v1/logs", host).toString(),
    headers: {
      authorization: `Bearer ${projectToken}`,
    },
  })
  const provider = new LoggerProvider({
    processors: [new SimpleLogRecordProcessor({ exporter })],
  })

  return {
    logger: provider.getLogger("cmsassstarter.posthog"),
    provider,
  }
}

const posthogLogging = getPostHogLogger()

export async function logPostHogAction(message: string): Promise<void> {
  if (!posthogLogging) {
    return
  }

  posthogLogging.logger.emit({
    body: message,
    severityText: "INFO",
  })
  await posthogLogging.provider.forceFlush()
}
