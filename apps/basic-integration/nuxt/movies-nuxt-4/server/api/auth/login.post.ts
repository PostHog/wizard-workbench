import { createHash } from 'node:crypto'
import process from 'node:process'
import { useServerPostHog } from '../../utils/posthog'

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
    const userId = createHash('sha256').update(sanitizedUsername).digest('hex')
    const distinctId = getHeader(event, 'x-posthog-distinct-id') || userId
    const sessionId = getHeader(event, 'x-posthog-session-id')
    const posthog = useServerPostHog()

    posthog.capture({
      distinctId,
      event: 'server_login_completed',
      properties: {
        $session_id: sessionId,
        source: 'api',
      },
    })
    await posthog.flush()

    setCookie(event, 'auth-user', sanitizedUsername, {
      httpOnly: false, // Allow client-side access for SSR
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    setCookie(event, 'auth-user-id', userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      success: true,
      user: sanitizedUsername,
      userId,
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
