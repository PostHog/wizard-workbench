import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";
import { createReactRouterErrorHandler, PostHog } from "posthog-node";

// Vite inlines VITE_ variables into the server build, so no runtime environment read is needed.
const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_POSTHOG_HOST;

if ((!token || !host) && import.meta.env.DEV) {
  const missingVariable = token
    ? "VITE_POSTHOG_HOST"
    : "VITE_POSTHOG_PROJECT_TOKEN";
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

// One server client captures unhandled exceptions and links page-load errors to the visitor.
export const posthog = token && host
  ? new PostHog(token, {
      host,
      enableExceptionAutocapture: true,
      readPostHogCookie: true,
    })
  : undefined;

export const handleError = posthog
  ? createReactRouterErrorHandler(posthog)
  : undefined;

// Keep log export separate from application loggers so only records added here leave the app.
const logProvider = token && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "rest-explorer-web",
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host}/i/v1/logs`,
            headers: { Authorization: `Bearer ${token}` },
            timeoutMillis: 2_000,
          }),
        }),
      ],
    })
  : undefined;

export const posthogLogger = logProvider?.getLogger("posthog-render-lifecycle");

// Export asynchronously only as the Node process exits; rendering never waits for log delivery.
if (logProvider) {
  process.once("beforeExit", () => {
    void logProvider.shutdown().catch(() => {});
  });
}
