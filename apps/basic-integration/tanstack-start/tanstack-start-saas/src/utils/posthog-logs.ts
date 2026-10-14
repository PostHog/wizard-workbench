import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'

let posthogLogSdk: NodeSDK | undefined
let posthogInvoiceLogger: ReturnType<typeof logs.getLogger> | undefined

function getRequiredLogConfig() {
  const token =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      )
    }
    return undefined
  }

  if (!host) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
      )
    }
    return undefined
  }

  return { host, token }
}

function getPostHogInvoiceLogger() {
  if (posthogInvoiceLogger) return posthogInvoiceLogger

  const config = getRequiredLogConfig()
  if (!config) return undefined

  posthogLogSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-invoice-api',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', config.host).toString(),
          headers: {
            Authorization: `Bearer ${config.token}`,
          },
        }),
      }),
    ],
  })
  posthogLogSdk.start()

  posthogInvoiceLogger = logs.getLogger('posthog.invoice_lifecycle')
  return posthogInvoiceLogger
}

export function logInvoiceCreated() {
  getPostHogInvoiceLogger()?.emit({
    severityText: 'INFO',
    body: 'Invoice created',
    attributes: { 'invoice.lifecycle_event': 'created' },
  })
}

export function logInvoicePaymentRequested() {
  getPostHogInvoiceLogger()?.emit({
    severityText: 'INFO',
    body: 'Invoice payment requested',
    attributes: { 'invoice.lifecycle_event': 'payment_requested' },
  })
}

export function logInvoiceMarkedPaid() {
  getPostHogInvoiceLogger()?.emit({
    severityText: 'INFO',
    body: 'Invoice marked paid',
    attributes: { 'invoice.lifecycle_event': 'marked_paid' },
  })
}
