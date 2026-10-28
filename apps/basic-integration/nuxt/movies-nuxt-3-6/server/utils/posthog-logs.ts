import { logs } from '@opentelemetry/api-logs'
import type { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'

const posthogLogger = logs.getLogger('posthog-exporter')
let posthogLogRecordProcessor: BatchLogRecordProcessor | undefined

export function setPostHogLogRecordProcessor(processor: BatchLogRecordProcessor) {
  posthogLogRecordProcessor = processor
}

export async function emitPostHogServerLog(
  severityText: 'info' | 'warn' | 'error',
  body: string,
  attributes: Record<string, string | number | boolean>,
) {
  if (!posthogLogRecordProcessor)
    return

  posthogLogger.emit({ severityText, body, attributes })
  await posthogLogRecordProcessor.forceFlush()
}
