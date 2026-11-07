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

if (posthogKey && posthogHost) {
  const exporter = new OTLPLogExporter({
    headers: { Authorization: `Bearer ${posthogKey}` },
    url: new URL("/i/v1/logs", posthogHost).toString(),
  });

  const loggerProvider = new LoggerProvider({
    processors: [new BatchLogRecordProcessor(exporter)],
    resource: resourceFromAttributes({
      "service.name": "saas-template",
    }),
  });
  posthogLogger = loggerProvider.getLogger("posthog-ssr-lifecycle");

  const shutdown = (signal: NodeJS.Signals) => {
    const timeoutId = setTimeout(() => {
      process.kill(process.pid, signal);
    }, 3000);

    void loggerProvider
      .shutdown()
      .catch((error: unknown) => {
        console.error("PostHog log exporter failed to shut down", error);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        process.kill(process.pid, signal);
      });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
} else if (process.env.NODE_ENV !== "production") {
  const missingVariable = posthogKey ? "VITE_POSTHOG_HOST" : "VITE_POSTHOG_KEY";
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export function emitPostHogServerLog(
  body: string,
  attributes?: Record<string, string | number | boolean>,
) {
  posthogLogger?.emit({
    attributes,
    body,
    severityText: "info",
  });
}
