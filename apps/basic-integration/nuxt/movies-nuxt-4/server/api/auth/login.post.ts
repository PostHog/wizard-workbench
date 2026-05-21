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

    const sessionId = getHeader(event, 'x-posthog-session-id')
    const distinctId = getHeader(event, 'x-posthog-distinct-id')

    const posthog = useServerPostHog()
    posthog.capture({
      distinctId: distinctId ?? sanitizedUsername,
      event: 'server_login',
      properties: {
        $session_id: sessionId,
        username: sanitizedUsername,
        source: 'api',
      },
    })

    return {
      success: true,
      user: sanitizedUsername,
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
