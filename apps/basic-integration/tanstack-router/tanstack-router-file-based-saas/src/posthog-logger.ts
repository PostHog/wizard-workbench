import posthog from './posthog'

export const posthogLogger = {
  signInCompleted: () => {
    posthog.logger.info('user sign-in completed', {
      login_method: 'credentials',
    })
  },
  invoiceCreated: (invoiceId: number) => {
    posthog.logger.info('invoice created', {
      invoice_id: invoiceId,
    })
  },
  invoiceUpdated: (invoiceId: number) => {
    posthog.logger.info('invoice updated', {
      invoice_id: invoiceId,
    })
  },
}
