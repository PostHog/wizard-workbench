import type { Logger } from '@opentelemetry/api-logs'

let posthogLogger: Logger | undefined

export function setPostHogLogger(logger: Logger) {
  posthogLogger = logger
}

export function emitPostHogLog(
  body: string,
  attributes: Record<string, string | number | boolean>,
) {
  posthogLogger?.emit({
    severityText: 'INFO',
    body,
    attributes,
  })
}
