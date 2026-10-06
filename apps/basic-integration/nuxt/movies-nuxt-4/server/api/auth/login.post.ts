import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'
import { emitPostHogLog } from '~/server/utils/posthog-log'

async function captureAuthEvent(event: Parameters<typeof getHeader>[0]) {
  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.public.posthogToken
  const host = runtimeConfig.public.posthogHost
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  if (!token || !host || !distinctId)
    return

  const posthog = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
  })

  try {
    await posthog.withContext({
      distinctId,
      sessionId: getHeader(event, 'x-posthog-session-id') ?? undefined,
    }, async () => {
      posthog.capture({ event: 'login_completed' })
    })
  }
  finally {
    await posthog.shutdown()
  }
}

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

    await captureAuthEvent(event)
    await emitPostHogLog('authentication login completed', {
      route: '/api/auth/login',
      outcome: 'success',
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
