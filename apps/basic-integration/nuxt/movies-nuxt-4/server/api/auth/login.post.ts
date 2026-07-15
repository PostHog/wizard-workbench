import { useServerPostHog } from '../../utils/posthog'

export default defineEventHandler(async (event) => {
  const posthog = useServerPostHog()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

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

    posthog.capture({
      distinctId: distinctId || `demo_user_${sanitizedUsername}`,
      event: 'server_login_completed',
      properties: {
        $session_id: sessionId,
        source: 'api',
      },
    })
    await posthog.flush()

    return {
      success: true,
      user: sanitizedUsername,
    }
  } catch (error: any) {
    posthog.captureException(error, distinctId || undefined)
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
