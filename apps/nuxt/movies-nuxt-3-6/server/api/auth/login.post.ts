import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

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
      posthog.capture({
        event: 'server_login_error',
        distinctId: distinctId ?? 'anonymous',
        properties: {
          error_message: 'Username and password are required',
          error_code: 400,
          $session_id: sessionId,
        },
      })
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

    posthog.capture({
      event: 'server_login_success',
      distinctId: distinctId ?? sanitizedUsername,
      properties: {
        username: sanitizedUsername,
        $session_id: sessionId,
      },
    })
    await posthog.shutdown()

    return {
      success: true,
      user: sanitizedUsername,
    }
  }
  catch (error: any) {
    if (!error.statusCode) {
      posthog.capture({
        event: 'server_login_error',
        distinctId: distinctId ?? 'anonymous',
        properties: {
          error_message: 'An error occurred during login',
          error_code: 500,
          $session_id: sessionId,
        },
      })
      await posthog.shutdown()

      throw createError({
        statusCode: 500,
        message: 'An error occurred during login',
      })
    }
    await posthog.shutdown()
    throw error
  }
})
