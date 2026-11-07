import { getPostHogLogLogger } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    // Validate input
    if (!username?.trim() || !password?.trim()) {
      getPostHogLogLogger()?.emit({
        severityText: 'WARN',
        body: 'auth_login_rejected',
        attributes: { reason: 'missing_credentials' },
      })
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

    getPostHogLogLogger()?.emit({
      severityText: 'INFO',
      body: 'auth_login_succeeded',
      attributes: { auth_flow: 'demo' },
    })

    return {
      success: true,
      user: sanitizedUsername,
    }
  }
  catch (error: any) {
    if (error.statusCode)
      throw error
    getPostHogLogLogger()?.emit({
      severityText: 'ERROR',
      body: 'auth_login_failed',
      attributes: { failure_type: 'unexpected_error' },
    })
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
