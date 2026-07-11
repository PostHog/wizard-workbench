import { createServerPostHog, getPostHogContext } from '~/server/utils/posthog'

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

    const posthog = createServerPostHog()
    const { distinctId, sessionId } = getPostHogContext(event)

    await posthog.withContext({ distinctId, sessionId }, async () => {
      posthog.capture({
        event: 'server_login_succeeded',
        distinctId: distinctId ?? sanitizedUsername,
        properties: {
          authentication_method: 'password',
          login_result: 'success',
        },
      })
    })

    await posthog.shutdown()

    return {
      success: true,
      user: sanitizedUsername,
    }
  }
  catch (error: any) {
    const posthog = createServerPostHog()
    const { distinctId, sessionId } = getPostHogContext(event)

    await posthog.captureException(error as Error, distinctId ?? 'anonymous', {
      $session_id: sessionId,
      endpoint: '/api/auth/login',
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
