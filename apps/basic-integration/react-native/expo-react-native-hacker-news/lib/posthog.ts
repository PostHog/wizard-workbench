import Constants from 'expo-constants'

const extra = Constants.expoConfig?.extra

export const posthogKey = extra?.posthogKey as string | undefined
export const posthogHost = extra?.posthogHost as string | undefined
export const isPostHogConfigured = Boolean(posthogKey && posthogHost)

if (__DEV__ && !isPostHogConfigured) {
  const missingVariable = posthogKey
    ? 'EXPO_PUBLIC_POSTHOG_HOST'
    : 'EXPO_PUBLIC_POSTHOG_KEY'

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  )
}
