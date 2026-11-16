import type { Logger } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";

const MODE = process.env.NODE_ENV ?? "development";
const posthogHost = process.env.VITE_PUBLIC_POSTHOG_HOST;
const posthogProjectToken = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;

let posthogLogger: Logger | undefined;

if (!posthogHost || !posthogProjectToken) {
  if (MODE !== "production") {
    const missingVariable = posthogHost
      ? "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN"
      : "VITE_PUBLIC_POSTHOG_HOST";
    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  const logExporter = new OTLPLogExporter({
    headers: {
      Authorization: `Bearer ${posthogProjectToken}`,
    },
    url: `${posthogHost.replace(/\/$/, "")}/i/v1/logs`,
  });
  const loggerProvider = new LoggerProvider({
    processors: [new BatchLogRecordProcessor({ exporter: logExporter })],
    resource: resourceFromAttributes({
      "deployment.environment": MODE,
      "service.name": "saas-template",
    }),
  });

  posthogLogger = loggerProvider.getLogger("posthog-exporter");
  posthogLogger.emit({
    attributes: { "log.event": "posthog_log_export_configured" },
    body: "PostHog log export configured",
    severityText: "INFO",
  });

  process.once("beforeExit", () => {
    void loggerProvider.shutdown().catch(() => undefined);
  });
}

type PostHogLogAttributes = Record<string, boolean | number | string>;

export function emitPostHogLog(
  body: string,
  severityText: "ERROR" | "INFO" | "WARN",
  attributes: PostHogLogAttributes,
) {
  posthogLogger?.emit({ attributes, body, severityText });
}
