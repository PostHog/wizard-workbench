import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null = null
let posthogLogger: ReturnType<LoggerProvider["getLogger"]> | null = null

export function getPostHogSessionProperties(request: Request) {
  const sessionId = request.headers.get("x-posthog-session-id")
  return sessionId ? { $session_id: sessionId } : {}
}

export function getPostHogLogger() {
  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (dev) {
      const variableName = !token
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      console.warn(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      )
    }
    return null
  }

  if (!posthogLogger) {
    const provider = new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "cmsaasstarter",
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL("i/v1/logs", `${host}/`).toString(),
            headers: { Authorization: `Bearer ${token}` },
          }),
        }),
      ],
    })
    posthogLogger = provider.getLogger("posthog-app-logs")
  }

  return posthogLogger
}

export function getPostHogClient() {
  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (dev) {
      const variableName = !token
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      console.warn(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      )
    }
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
      requestTimeout: 2000,
      fetchRetryCount: 0,
    })
  }

  return posthogClient
}
