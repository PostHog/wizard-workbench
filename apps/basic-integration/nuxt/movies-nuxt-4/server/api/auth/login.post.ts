import process from 'node:process'
import { emitPostHogLog } from '~/server/utils/posthog-logs'

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

    emitPostHogLog('INFO', 'Authentication login completed', {
      event: 'auth_login_completed',
      outcome: 'success',
    })

    return {
      success: true,
      user: sanitizedUsername,
    }
  }
  catch (error: any) {
    if (error.statusCode) {
      emitPostHogLog('WARN', 'Authentication login rejected', {
        event: 'auth_login_completed',
        outcome: 'rejected',
        status_code: error.statusCode,
      })
      throw error
    }
    emitPostHogLog('ERROR', 'Authentication login failed', {
      event: 'auth_login_completed',
      outcome: 'failed',
    })
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
