import { logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";

const loggerName = "saas-template-posthog";
const mode = process.env.NODE_ENV ?? "development";
let isInitialized = false;

export function initializePostHogLogs() {
  if (isInitialized) {
    return;
  }

  const projectToken = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.VITE_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (mode !== "production") {
      const missingVariable = projectToken
        ? "VITE_PUBLIC_POSTHOG_HOST"
        : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }
    return;
  }

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      "deployment.environment": mode,
      "service.name": "saas-template-server",
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          headers: { Authorization: `Bearer ${projectToken}` },
          url: new URL("/i/v1/logs", host).toString(),
        }),
      ),
    ],
  });

  sdk.start();
  isInitialized = true;
}

export function logPostHogInfo(
  body: string,
  attributes?: Record<string, boolean | number | string>,
) {
  if (!isInitialized) {
    return;
  }

  logs.getLogger(loggerName).emit({
    attributes,
    body,
    severityText: "info",
  });
}
