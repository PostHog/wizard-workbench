import { useServerPostHog } from '~/server/utils/posthog'

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
    const distinctId = getHeader(event, 'x-posthog-distinct-id')
    const sessionId = getHeader(event, 'x-posthog-session-id')

    setCookie(event, 'auth-user', sanitizedUsername, {
      httpOnly: false, // Allow client-side access for SSR
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    if (distinctId) {
      await posthog?.capture({
        distinctId,
      event: 'server_login_succeeded',
      properties: {
        $session_id: sessionId,
        auth_method: 'password',
        login_state: 'success',
      },
      })
    }

    return {
      success: true,
      user: sanitizedUsername,
    }
  } catch (error: any) {
    await posthog?.captureException(error, getHeader(event, 'x-posthog-distinct-id') || undefined)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
