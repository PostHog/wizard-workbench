import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const posthogKey = process.env.VITE_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.VITE_PUBLIC_POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === "production";

let logger: ReturnType<LoggerProvider["getLogger"]> | undefined;

if (!posthogKey || !posthogHost) {
  if (!isProduction) {
    const missingVariable = posthogKey
      ? "VITE_PUBLIC_POSTHOG_HOST"
      : "VITE_PUBLIC_POSTHOG_KEY";
    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  const provider = new LoggerProvider({
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          headers: { Authorization: `Bearer ${posthogKey}` },
          url: new URL("/i/v1/logs", posthogHost).toString(),
        }),
      }),
    ],
    resource: resourceFromAttributes({
      "deployment.environment": process.env.NODE_ENV ?? "development",
      "service.name": "saas-template-server",
    }),
  });

  logger = provider.getLogger("posthog-app-logs");

  const shutdown = () => {
    void provider.shutdown().catch(() => {
      // Keep shutdown non-blocking if log export fails.
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

export function logPostHogInfo(
  body: string,
  attributes: Record<string, boolean | number | string>,
) {
  logger?.emit({ attributes, body, severityText: "info" });
}
