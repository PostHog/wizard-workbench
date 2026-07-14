import { useServerPostHog } from '../../utils/posthog'

export default defineEventHandler(async (event) => {
  const posthog = useServerPostHog()

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
    const sessionId = getHeader(event, 'x-posthog-session-id')
    const distinctId = getHeader(event, 'x-posthog-distinct-id') || sanitizedUsername

    setCookie(event, 'auth-user', sanitizedUsername, {
      httpOnly: false, // Allow client-side access for SSR
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    posthog.capture({
      distinctId,
      event: 'server_login_succeeded',
      properties: {
        $session_id: sessionId,
        auth_method: 'password',
        source: 'api',
      },
    })
    await posthog.flush()

    return {
      success: true,
      user: sanitizedUsername,
    }
  } catch (error: any) {
    const distinctId = getHeader(event, 'x-posthog-distinct-id') || 'anonymous'
    posthog.captureException(error, distinctId)
    await posthog.flush()

    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
