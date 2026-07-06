import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
    host: runtimeConfig.public.posthog.host,
    enableExceptionAutocapture: true,
  })

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

    await posthog.withContext({
      sessionId: sessionId ?? undefined,
      distinctId: distinctId ?? sanitizedUsername,
    }, async () => {
      posthog.capture({
        event: 'server_login_succeeded',
        distinctId: distinctId ?? sanitizedUsername,
        properties: {
          authentication_method: 'password',
        },
      })
    })

    return {
      success: true,
      user: sanitizedUsername,
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      await posthog.captureException(error, distinctId ?? 'anonymous', {
        endpoint: '/api/auth/login',
      })
      throw error
    }

    await posthog.captureException(error, distinctId ?? 'anonymous', {
      endpoint: '/api/auth/login',
    })
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
  finally {
    await posthog.shutdown()
  }
})
