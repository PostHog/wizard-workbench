import { PostHog } from 'posthog-node'

let posthogLogsClient: PostHog | null | undefined

function getPostHogLogsClient() {
  if (posthogLogsClient !== undefined) return posthogLogsClient

  const token =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST || import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = !token
        ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'VITE_PUBLIC_POSTHOG_HOST'
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }
    posthogLogsClient = null
    return posthogLogsClient
  }

  posthogLogsClient = new PostHog(token, {
    host,
    logs: {
      serviceName: 'tanstack-start-saas',
    },
  })

  return posthogLogsClient
}

export function logInvoiceCreated(invoice: { id: number; amount: number }) {
  getPostHogLogsClient()?.logger.info('invoice created', {
    invoice_id: invoice.id,
    amount: invoice.amount,
  })
}

export function logInvoiceMarkedPaid(invoice: { id: number; amount: number }) {
  getPostHogLogsClient()?.logger.info('invoice marked paid', {
    invoice_id: invoice.id,
    amount: invoice.amount,
  })
}
