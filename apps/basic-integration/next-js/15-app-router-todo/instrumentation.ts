import { SeverityNumber } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

let loggerProvider: LoggerProvider | undefined

function throwMissingConfiguration(variableName: string): void {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    )
  }
}

export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  if (!projectToken) {
    throwMissingConfiguration("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN")
    return
  }

  if (!host) {
    throwMissingConfiguration("NEXT_PUBLIC_POSTHOG_HOST")
    return
  }

  if (loggerProvider) return

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ "service.name": "nextjs-todo-app" }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, "")}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    ],
  })
}

export function logTodoMutation(action: "created" | "updated" | "deleted", completed?: boolean) {
  register()
  loggerProvider?.getLogger("posthog-todo-log-export").emit({
    body: `Todo ${action}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      "todo.action": action,
      ...(completed === undefined ? {} : { "todo.completed": completed }),
    },
  })
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush()
}
