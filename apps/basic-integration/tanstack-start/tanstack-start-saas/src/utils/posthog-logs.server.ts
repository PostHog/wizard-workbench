import { logs, type Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'

let logger: Logger | undefined

function getPostHogLogLogger() {
  if (logger) return logger

  const projectToken =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST || import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = projectToken
        ? 'VITE_PUBLIC_POSTHOG_HOST'
        : 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return undefined
  }

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-example-basic',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      }),
    ],
  })

  sdk.start()
  logger = logs.getLogger('posthog-integration')
  return logger
}

export function logInvoiceCreated() {
  getPostHogLogLogger()?.emit({
    severityText: 'INFO',
    body: 'invoice_creation_completed',
    attributes: {
      operation: 'create_invoice',
      source: 'server_function',
    },
  })
}

export function logInvoiceMarkedPaid() {
  getPostHogLogLogger()?.emit({
    severityText: 'INFO',
    body: 'invoice_payment_completed',
    attributes: {
      operation: 'mark_invoice_paid',
      source: 'server_function',
    },
  })
}
