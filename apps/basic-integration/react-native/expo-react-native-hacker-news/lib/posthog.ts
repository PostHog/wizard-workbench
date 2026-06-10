import PostHog from 'posthog-react-native'

type CaptureProperties = Parameters<PostHog['capture']>[1]

let _posthog: PostHog | undefined

export const initPostHog = () => {
  _posthog = new PostHog(process.env.EXPO_PUBLIC_POSTHOG_TOKEN || '', {
    host: process.env.EXPO_PUBLIC_POSTHOG_HOST || '',
  })

  // Forward uncaught JS exceptions to PostHog (React Native's global error hook)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorUtils = (global as any).ErrorUtils
  if (errorUtils) {
    const previousHandler = errorUtils.getGlobalHandler()
    errorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      _posthog?.captureException(error)
      previousHandler?.(error, isFatal)
    })
  }
}

export function capture(event: string, properties?: CaptureProperties) {
  _posthog?.capture(event, properties)
}
