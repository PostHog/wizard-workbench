import { emitPostHogServerLog } from '../../utils/posthog-logs'

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

    await emitPostHogServerLog('info', 'Demo login accepted', {
      route: '/api/auth/login',
    })

    return {
      success: true,
      user: sanitizedUsername,
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      await emitPostHogServerLog('warn', 'Demo login rejected', {
        route: '/api/auth/login',
        status_code: error.statusCode,
      })
      throw error
    }
    await emitPostHogServerLog('error', 'Demo login failed', {
      route: '/api/auth/login',
      status_code: 500,
    })
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
