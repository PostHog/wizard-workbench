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
    const distinctId = getHeader(event, 'x-posthog-distinct-id')
    const sessionId = getHeader(event, 'x-posthog-session-id')
    const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
      host: runtimeConfig.public.posthog.host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })

    await posthog.withContext(
      { distinctId: distinctId ?? undefined, sessionId: sessionId ?? undefined },
      async () => {
        posthog.capture({
          distinctId: distinctId ?? 'anonymous',
          event: 'login_completed',
          properties: { authentication_method: 'password' },
        })
      },
    )
    await posthog.shutdown()

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
