import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let loggerProvider: LoggerProvider | undefined
let posthogLogger: Logger | undefined

function getPosthogLogger(): Logger | undefined {
  if (posthogLogger) {
    return posthogLogger
  }

  const { public: publicConfig } = useRuntimeConfig()
  const { key, host } = publicConfig.posthog

  if (!key || !host) {
    return undefined
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${key}`,
          },
        }),
      }),
    ],
  })

  posthogLogger = loggerProvider.getLogger('movies-nuxt.posthog')
  return posthogLogger
}

export function logAuthenticationSucceeded() {
  getPosthogLogger()?.emit({
    severityText: 'info',
    body: 'authentication_succeeded',
    attributes: {
      'app.component': 'authentication',
    },
  })
}

export function logAuthenticationInputRejected() {
  getPosthogLogger()?.emit({
    severityText: 'warn',
    body: 'authentication_input_rejected',
    attributes: {
      'app.component': 'authentication',
    },
  })
}

export async function shutdownPosthogLogs() {
  await loggerProvider?.shutdown()
}
