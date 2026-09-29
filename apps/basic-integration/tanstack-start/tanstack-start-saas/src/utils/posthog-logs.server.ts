import { SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs'

const projectToken =
  process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host =
  process.env.VITE_PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_PUBLIC_POSTHOG_HOST

let loggerProvider: LoggerProvider | undefined

function getLoggerProvider() {
  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !projectToken
        ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'VITE_PUBLIC_POSTHOG_HOST'
      console.error(
        new Error(
          `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
        ),
      )
    }

    return undefined
  }

  if (!loggerProvider) {
    const exporter = new OTLPLogExporter({
      url: new URL('/i/v1/logs', host).toString(),
      headers: {
        Authorization: `Basic ${Buffer.from(`${projectToken}:`).toString('base64')}`,
      },
    })

    loggerProvider = new LoggerProvider({
      processors: [new SimpleLogRecordProcessor({ exporter })],
    })
  }

  return loggerProvider
}

export async function recordInvoiceLog(
  message: 'invoice_created' | 'invoice_marked_paid',
  invoiceId: number,
) {
  const provider = getLoggerProvider()
  if (!provider) return

  provider.getLogger('cloudflow.posthog').emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: message,
    attributes: {
      invoice_id: invoiceId,
    },
  })

  await provider.forceFlush()
}
