import { logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";

const posthogHost = process.env.VITE_PUBLIC_POSTHOG_HOST;
const posthogProjectToken = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const environment = process.env.NODE_ENV ?? "development";

let posthogServerLogger: ReturnType<typeof logs.getLogger> | undefined;

if (!posthogHost || !posthogProjectToken) {
  const missingVariable = posthogHost
    ? "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN"
    : "VITE_PUBLIC_POSTHOG_HOST";

  if (environment === "development") {
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  const posthogLogsSdk = new NodeSDK({
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          headers: { Authorization: `Bearer ${posthogProjectToken}` },
          url: new URL("/i/v1/logs", posthogHost).toString(),
        }),
      }),
    ],
    resource: resourceFromAttributes({
      "deployment.environment": environment,
      "service.name": "saas-template-server",
    }),
  });

  posthogLogsSdk.start();
  posthogServerLogger = logs.getLogger("posthog-server");
}

export function logServerRenderReady(renderMode: string) {
  posthogServerLogger?.emit({
    attributes: { render_mode: renderMode },
    body: "server render shell ready",
    severityText: "INFO",
  });
}
