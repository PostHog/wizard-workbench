import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const projectToken =
  process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.VITE_PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_PUBLIC_POSTHOG_HOST

let invoiceLogger: ReturnType<LoggerProvider['getLogger']> | undefined

if (!projectToken || !host) {
  const missingVariable = !projectToken
    ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : 'VITE_PUBLIC_POSTHOG_HOST'
  const message = `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`

  if (process.env.NODE_ENV !== 'production') {
    console.warn(message)
  }
} else {
  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'cloudflow-tanstack-start',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      }),
    ],
  })
  invoiceLogger = loggerProvider.getLogger('posthog.invoice-lifecycle')
}

export function logInvoiceCreated() {
  invoiceLogger?.emit({
    severityText: 'INFO',
    body: 'invoice_created_on_server',
    attributes: {
      workflow: 'invoice',
      outcome: 'created',
    },
  })
}

export function logInvoiceMarkedPaid() {
  invoiceLogger?.emit({
    severityText: 'INFO',
    body: 'invoice_marked_paid_on_server',
    attributes: {
      workflow: 'invoice',
      outcome: 'paid',
    },
  })
}
