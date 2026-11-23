import { SeverityNumber, type Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let logger: Logger | null | undefined
let loggerProvider: LoggerProvider | null = null

function getPostHogLogger(): Logger | null {
  if (logger !== undefined) return logger

  const token =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST || import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = token
        ? 'VITE_PUBLIC_POSTHOG_HOST'
        : 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      )
    }
    logger = null
    return logger
  }

  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: { Authorization: `Bearer ${token}` },
  })

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-example-basic',
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  })
  logger = loggerProvider.getLogger('posthog-integration')
  return logger
}

export function logInvoiceCreated(invoiceId: number, amount: number) {
  getPostHogLogger()?.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: 'invoice_created',
    attributes: { invoice_id: invoiceId, amount },
  })
}

export function logInvoiceMarkedPaid(invoiceId: number, amount: number) {
  getPostHogLogger()?.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: 'invoice_marked_paid',
    attributes: { invoice_id: invoiceId, amount },
  })
}

