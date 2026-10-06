type LogAttributes = Record<string, string | number | boolean>
type LogLevel = "info" | "warn" | "error"

function isPostHogConfigured() {
  return Boolean(
    import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST,
  )
}

function sendPostHogLog(level: LogLevel, message: string, attributes: LogAttributes) {
  if (!isPostHogConfigured()) return

  void import("posthog-js")
    .then(({ default: posthog }) => {
      if (level === "info") {
        posthog.logger.info(message, attributes)
      } else if (level === "warn") {
        posthog.logger.warn(message, attributes)
      } else {
        posthog.logger.error(message, attributes)
      }
    })
    .catch(() => undefined)
}

export const posthogLog = {
  info: (message: string, attributes: LogAttributes) =>
    sendPostHogLog("info", message, attributes),
  warn: (message: string, attributes: LogAttributes) =>
    sendPostHogLog("warn", message, attributes),
  error: (message: string, attributes: LogAttributes) =>
    sendPostHogLog("error", message, attributes),
}
