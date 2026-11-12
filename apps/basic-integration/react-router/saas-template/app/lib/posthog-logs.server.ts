import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const posthogToken = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.VITE_PUBLIC_POSTHOG_HOST;

let logger: ReturnType<LoggerProvider["getLogger"]> | undefined;

if (!posthogToken) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
    );
  }
} else if (!posthogHost) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
    );
  }
} else {
  const exporter = new OTLPLogExporter({
    headers: { Authorization: `Bearer ${posthogToken}` },
    url: new URL("i/v1/logs", `${posthogHost.replace(/\/$/, "")}/`).toString(),
  });
  const loggerProvider = new LoggerProvider({
    processors: [new BatchLogRecordProcessor(exporter)],
    resource: resourceFromAttributes({
      "deployment.environment.name": process.env.NODE_ENV ?? "development",
      "service.name": "saas-template-server",
    }),
  });

  logger = loggerProvider.getLogger("posthog-exporter");
}

export function logPostHogInfo(
  body: string,
  attributes: Record<string, boolean | number | string>,
) {
  logger?.emit({ attributes, body, severityText: "info" });
}
