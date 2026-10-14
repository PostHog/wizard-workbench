import { SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs'

const posthogProjectToken =
  process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost =
  process.env.VITE_PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_PUBLIC_POSTHOG_HOST

let posthogLogProvider: LoggerProvider | null = null

function requirePostHogConfiguration() {
  if (import.meta.env.DEV && !posthogProjectToken) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
    )
  }

  if (import.meta.env.DEV && !posthogHost) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured',
    )
  }
}

function getPostHogLogProvider() {
  requirePostHogConfiguration()

  if (!posthogProjectToken || !posthogHost) {
    return null
  }

  if (!posthogLogProvider) {
    const exporter = new OTLPLogExporter({
      url: new URL('/i/v1/logs', posthogHost).toString(),
      headers: {
        Authorization: `Bearer ${posthogProjectToken}`,
      },
    })

    posthogLogProvider = new LoggerProvider({
      processors: [new SimpleLogRecordProcessor({ exporter })],
    })
  }

  return posthogLogProvider
}

export async function logPostHogInvoiceOperation(operation: string) {
  const provider = getPostHogLogProvider()
  if (!provider) {
    return
  }

  provider.getLogger('posthog-invoice-operations').emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: `Invoice ${operation} through API`,
    attributes: {
      'app.operation': operation,
    },
  })

  await provider.forceFlush()
}
