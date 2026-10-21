import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";

const projectToken = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.VITE_PUBLIC_POSTHOG_HOST;

function getPostHogLogsLogger() {
  if (!projectToken) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      );
    }

    return undefined;
  }

  if (!posthogHost) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
      );
    }

    return undefined;
  }

  const exporter = new OTLPLogExporter({
    headers: { Authorization: `Bearer ${projectToken}` },
    url: `${posthogHost.replace(/\/$/, "")}/i/v1/logs`,
  });
  const loggerProvider = new LoggerProvider({
    processors: [new BatchLogRecordProcessor(exporter)],
    resource: resourceFromAttributes({ "service.name": "saas-template" }),
  });

  return loggerProvider.getLogger("posthog-integration");
}

const posthogLogsLogger = getPostHogLogsLogger();

export function logPostHogOperation(
  operation: "organization_created" | "checkout_session_created",
) {
  const body =
    operation === "organization_created"
      ? "Organization creation completed"
      : "Stripe checkout session creation completed";

  posthogLogsLogger?.emit({
    attributes: { operation },
    body,
    severityText: "info",
  });
}
