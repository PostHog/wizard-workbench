import { createHash } from 'node:crypto'
import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'

function getAnalyticsId(username: string) {
  return createHash('sha256').update(username).digest('hex')
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    // Validate input
    if (!username?.trim() || !password?.trim()) {
      throw createError({
        statusCode: 400,
        message: 'Username and password are required',
      })
    }

    // Demo auth: accepts any username and password
    const sanitizedUsername = username.trim()
    const analyticsId = getAnalyticsId(sanitizedUsername)
    const runtimeConfig = useRuntimeConfig()
    const sessionId = getHeader(event, 'x-posthog-session-id')
    const distinctId = getHeader(event, 'x-posthog-distinct-id')
    const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
      host: runtimeConfig.public.posthog.host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })

    await posthog.withContext(
      { sessionId: sessionId ?? undefined, distinctId: distinctId ?? analyticsId },
      async () => {
        posthog.capture({
          event: 'login_completed',
          distinctId: distinctId ?? analyticsId,
        })
      },
    )
    await posthog.shutdown()

    setCookie(event, 'auth-user', sanitizedUsername, {
      httpOnly: false, // Allow client-side access for SSR
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    setCookie(event, 'auth-analytics-id', analyticsId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      success: true,
      user: sanitizedUsername,
      analyticsId,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
