import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";

const projectToken = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.VITE_PUBLIC_POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === "production";

function warnForMissingConfiguration(variableName: string) {
  if (!isProduction) {
    console.warn(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

function createPostHogLogger() {
  if (!projectToken) {
    warnForMissingConfiguration("VITE_PUBLIC_POSTHOG_PROJECT_TOKEN");
    return;
  }

  if (!posthogHost) {
    warnForMissingConfiguration("VITE_PUBLIC_POSTHOG_HOST");
    return;
  }

  try {
    const loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "saas-template",
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: new URL("/i/v1/logs", posthogHost).toString(),
            headers: {
              Authorization: `Bearer ${projectToken}`,
            },
          }),
        ),
      ],
    });

    process.once("beforeExit", () => {
      void loggerProvider.shutdown().catch((error: unknown) => {
        console.warn("Unable to flush PostHog logs during shutdown", error);
      });
    });

    return loggerProvider.getLogger("posthog-app-logs");
  } catch {
    if (!isProduction) {
      console.warn("PostHog log export could not be configured");
    }
  }
}

const posthogLogger = createPostHogLogger();

export function logPostHog(
  severityText: "INFO" | "ERROR",
  body: string,
  attributes?: Record<string, string | number | boolean>,
) {
  posthogLogger?.emit({ severityText, body, attributes });
}
