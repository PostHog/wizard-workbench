import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

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

    setCookie(event, 'auth-user', sanitizedUsername, {
      httpOnly: false, // Allow client-side access for SSR
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    const runtimeConfig = useRuntimeConfig()
    const projectToken = runtimeConfig.public.posthog.publicKey
    const host = runtimeConfig.public.posthog.host
    if (projectToken && host) {
      try {
        const posthog = new PostHog(projectToken, {
          host,
          enableExceptionAutocapture: true,
          flushAt: 1,
          flushInterval: 0,
        })
        const distinctId = getHeader(event, 'x-posthog-distinct-id') ?? 'DISTINCT_ID'
        const sessionId = getHeader(event, 'x-posthog-session-id')

        posthog.capture({
          event: 'login_completed',
          distinctId,
          properties: {
            $session_id: sessionId ?? undefined,
          },
        })
        await posthog.shutdown()
      }
      catch (error) {
        console.warn('PostHog login capture failed:', error)
      }
    }

    return {
      success: true,
      user: sanitizedUsername,
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
