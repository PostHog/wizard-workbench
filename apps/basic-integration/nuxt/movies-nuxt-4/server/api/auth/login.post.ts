import { useServerPostHog } from '~/server/utils/posthog'
import { getPostHogDistinctId } from '~/utils/posthog'

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

    const posthog = useServerPostHog()
    const sessionId = getHeader(event, 'x-posthog-session-id')
    const distinctId = getHeader(event, 'x-posthog-distinct-id') || getPostHogDistinctId(sanitizedUsername)

    posthog.capture({
      distinctId,
      event: 'server_login_succeeded',
      properties: {
        $session_id: sessionId,
        authentication_method: 'password',
        login_surface: 'login_page',
      },
    })

    setCookie(event, 'auth-user', sanitizedUsername, {
      httpOnly: false, // Allow client-side access for SSR
      secure: !import.meta.dev,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return {
      success: true,
      user: sanitizedUsername,
    }
  }
  catch (error: any) {
    const body = await readBody(event).catch(() => null)
    const username = typeof body?.username === 'string' ? body.username.trim() : ''
    const posthog = useServerPostHog()
    const sessionId = getHeader(event, 'x-posthog-session-id')
    const distinctId = username ? getPostHogDistinctId(username) : getHeader(event, 'x-posthog-distinct-id') || 'anonymous_auth_attempt'

    posthog.capture({
      distinctId,
      event: 'user_login_failed',
      properties: {
        $session_id: sessionId,
        authentication_method: 'password',
        error_type: error?.statusCode ? 'http_error' : 'server_error',
      },
    })
    posthog.captureException(error, distinctId)

    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
