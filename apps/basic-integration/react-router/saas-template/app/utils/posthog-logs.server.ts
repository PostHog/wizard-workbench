import type { Logger } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";

let posthogLogger: Logger | undefined;

export function initializePostHogLogs() {
  if (posthogLogger) {
    return posthogLogger;
  }

  const projectToken = process.env.VITE_POSTHOG_PROJECT_TOKEN;
  const host = process.env.VITE_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== "production") {
      const missingVariable = !projectToken
        ? "VITE_POSTHOG_PROJECT_TOKEN"
        : "VITE_POSTHOG_HOST";
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    return undefined;
  }

  const provider = new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "saas-template",
      "deployment.environment": process.env.NODE_ENV ?? "development",
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, "")}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      ),
    ],
  });

  process.once("beforeExit", () => {
    void provider.forceFlush().catch(() => undefined);
  });

  posthogLogger = provider.getLogger("posthog-server-renderer");
  return posthogLogger;
}

export function logServerRenderCompleted(
  logger: Logger | undefined,
  statusCode: number,
  renderingMode: "shell_ready" | "all_ready",
) {
  logger?.emit({
    severityText: "INFO",
    body: "Server render completed",
    attributes: {
      event: "server_render_completed",
      response_status: statusCode,
      rendering_mode: renderingMode,
    },
  });
}

export function logServerRenderFailed(logger: Logger | undefined) {
  logger?.emit({
    severityText: "ERROR",
    body: "Server render failed",
    attributes: {
      event: "server_render_failed",
      response_status: 500,
    },
  });
}
