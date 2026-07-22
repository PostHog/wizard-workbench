import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'

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

    const runtimeConfig = useRuntimeConfig()
    const { publicKey, host } = runtimeConfig.public.posthog
    const distinctId = getHeader(event, 'x-posthog-distinct-id')
    if (publicKey && host && distinctId) {
      const posthog = new PostHog(publicKey, {
        host,
        enableExceptionAutocapture: true,
        flushAt: 1,
        flushInterval: 0,
      })

      posthog.capture({
        event: 'auth_login_succeeded',
        distinctId,
      })
      await posthog.shutdown()
    }

    return {
      success: true,
      user: sanitizedUsername,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login',
    })
  }
})
