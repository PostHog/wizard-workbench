import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let loggerProvider: LoggerProvider | undefined

function getPostHogLogger() {
  if (loggerProvider) {
    return loggerProvider.getLogger('posthog-integration')
  }

  const projectToken =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST ||
    import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = projectToken
        ? 'VITE_PUBLIC_POSTHOG_HOST'
        : 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      )
    }

    return undefined
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-saas',
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

  return loggerProvider.getLogger('posthog-integration')
}

export async function logInvoiceCreated(invoiceId: number) {
  const logger = getPostHogLogger()
  if (!logger) return

  logger.emit({
    severityText: 'info',
    body: 'invoice created',
    attributes: {
      'app.action': 'invoice_created',
      'invoice.id': invoiceId,
    },
  })

  await loggerProvider?.forceFlush()
}

export async function logInvoiceMarkedPaid(invoiceId: number) {
  const logger = getPostHogLogger()
  if (!logger) return

  logger.emit({
    severityText: 'info',
    body: 'invoice marked paid',
    attributes: {
      'app.action': 'invoice_marked_paid',
      'invoice.id': invoiceId,
    },
  })

  await loggerProvider?.forceFlush()
}
