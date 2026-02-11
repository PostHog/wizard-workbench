import process from 'node:process'
import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  // Relies on __add_tracing_headers being set in the client-side SDK
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  const posthog = new PostHog(
    runtimeConfig.public.posthogPublicKey,
    {
      host: runtimeConfig.public.posthogHost,
    },
  )

  try {
    const body = await readBody(event)
    const { username, password } = body

    // Validate input
    if (!username?.trim() || !password?.trim()) {
      // Track failed login attempt
      await posthog.withContext(
        { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
        async () => {
          posthog.capture({
            event: 'server_login_failed',
            distinctId: distinctId ?? 'anonymous',
            properties: {
              reason: 'missing_credentials',
            },
          })
        },
      )
      await posthog.shutdown()

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

    // Track successful login
    await posthog.withContext(
      { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
      async () => {
        posthog.capture({
          event: 'server_login_success',
          distinctId: distinctId ?? sanitizedUsername,
        })
      },
    )

    // Always shutdown to ensure all events are flushed
    await posthog.shutdown()

    return {
      success: true,
      user: sanitizedUsername,
    }
  }
  catch (error: any) {
    // Track login error
    await posthog.withContext(
      { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
      async () => {
        posthog.capture({
          event: 'server_login_failed',
          distinctId: distinctId ?? 'anonymous',
          properties: {
            reason: 'server_error',
            error_message: error.message,
          },
        })
      },
    )
    await posthog.shutdown()

    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
