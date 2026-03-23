import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const sessionId = getHeader(event, 'x-posthog-session-id')

  const posthog = new PostHog(runtimeConfig.public.posthogToken, {
    host: runtimeConfig.public.posthogHost,
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

    const eventDistinctId = distinctId || sanitizedUsername
    posthog.capture({
      event: 'server_user_logged_in',
      distinctId: eventDistinctId,
      properties: {
        username: sanitizedUsername,
        ...(sessionId ? { $session_id: sessionId } : {}),
      },
    })
    await posthog.shutdown()

    return {
      success: true,
      user: sanitizedUsername,
    }
  }
  catch (error: any) {
    const eventDistinctId = distinctId || 'anonymous'
    posthog.capture({
      event: 'server_login_failed',
      distinctId: eventDistinctId,
      properties: {
        error_message: error.message,
        status_code: error.statusCode || 500,
        ...(sessionId ? { $session_id: sessionId } : {}),
      },
    })
    await posthog.shutdown()

    if (error.statusCode)
      throw error

    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
