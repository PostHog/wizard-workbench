import type { Logger } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";

const posthogKey = process.env.VITE_POSTHOG_KEY;
const posthogHost = process.env.VITE_POSTHOG_HOST;

let posthogLogger: Logger | undefined;

if (!posthogKey || !posthogHost) {
  if (process.env.NODE_ENV !== "production") {
    const missingVariable = posthogKey
      ? "VITE_POSTHOG_HOST"
      : "VITE_POSTHOG_KEY";
    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  const exporter = new OTLPLogExporter({
    headers: {
      Authorization: `Bearer ${posthogKey}`,
    },
    url: new URL("/i/v1/logs", posthogHost).toString(),
  });
  const provider = new LoggerProvider({
    processors: [new BatchLogRecordProcessor(exporter)],
    resource: resourceFromAttributes({
      "service.name": "saas-template",
    }),
  });

  posthogLogger = provider.getLogger("posthog-integration");

  process.once("beforeExit", () => {
    void provider.shutdown().catch(() => {});
  });
}

export function logPostHogInfo(
  body: string,
  attributes: Record<string, boolean | number | string> = {},
) {
  posthogLogger?.emit({
    attributes,
    body,
    severityText: "info",
  });
}
