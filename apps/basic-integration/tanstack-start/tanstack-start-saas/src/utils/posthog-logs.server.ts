import { logs, SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'

let invoiceLogger: ReturnType<typeof logs.getLogger> | null = null

function getInvoiceLogger() {
  if (invoiceLogger) return invoiceLogger

  const apiKey =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const apiHost =
    process.env.VITE_PUBLIC_POSTHOG_HOST ||
    import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!apiKey || !apiHost) {
    const missingVariable = !apiKey
      ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
      : 'VITE_PUBLIC_POSTHOG_HOST'

    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return null
  }

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'cloudflow-tanstack-start',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', apiHost).toString(),
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }),
      }),
    ],
  })

  sdk.start()
  invoiceLogger = logs.getLogger('posthog-integration.invoices')
  return invoiceLogger
}

export function logInvoiceCreated(amount: number) {
  getInvoiceLogger()?.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: 'invoice created',
    attributes: {
      event: 'invoice.created',
      amount,
      status: 'pending',
    },
  })
}

export function logInvoicePaid(amount: number) {
  getInvoiceLogger()?.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: 'invoice paid',
    attributes: {
      event: 'invoice.paid',
      amount,
      status: 'paid',
    },
  })
}
