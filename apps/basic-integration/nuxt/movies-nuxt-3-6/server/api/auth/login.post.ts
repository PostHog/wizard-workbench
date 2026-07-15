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
    const runtimeConfig = useRuntimeConfig()
    const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
      host: runtimeConfig.public.posthog.host,
      flushAt: 1,
      flushInterval: 0,
    })
    posthog.capture({
      event: 'server_login_succeeded',
      distinctId: sanitizedUsername,
    })
    await posthog.shutdown()
    
    setCookie(event, 'auth-user', sanitizedUsername, {
      httpOnly: false, // Allow client-side access for SSR
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

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
