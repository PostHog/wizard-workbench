type LogAttributes = Record<string, boolean | number | string>

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST
)

function info(message: string, attributes: LogAttributes) {
  if (!isPostHogConfigured || typeof window === 'undefined') return

  void import('posthog-js').then(({ default: posthog }) => {
    posthog.logger.info(message, attributes)
  })
}

export const posthogLog = {
  followerPackageSelected: (attributes: LogAttributes) => {
    info('follower package selected', attributes)
  },
  fakeFollowersPurchaseCompleted: (attributes: LogAttributes) => {
    info('fake followers purchase completed', attributes)
  },
}
