import { createContext } from 'react-router'
import { PostHog } from 'posthog-node'
import type { Route } from '../+types/root'

export const posthogContext = createContext<PostHog | undefined>(undefined)

export const posthogMiddleware: Route.MiddlewareFunction = async ({ request, context }, next) => {
  const posthog = new PostHog(process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.VITE_PUBLIC_POSTHOG_HOST!,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  })

  const sessionId = request.headers.get('X-POSTHOG-SESSION-ID')
  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID')

  ;(context as unknown as { set: (key: typeof posthogContext, value: PostHog) => void }).set(posthogContext, posthog)

  const response = await posthog.withContext({ sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined }, next)

  await posthog.shutdown().catch(() => {})

  return response
}
