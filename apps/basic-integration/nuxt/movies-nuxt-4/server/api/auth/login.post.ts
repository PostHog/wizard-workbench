import process from 'node:process'
import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'
import { getPostHogLogger } from '~/server/utils/posthog-logs'

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

    const { key, host } = useRuntimeConfig().public.posthog
    const distinctId = getHeader(event, 'x-posthog-distinct-id')
    const sessionId = getHeader(event, 'x-posthog-session-id')

    if (key && host && distinctId) {
      try {
        const posthog = new PostHog(key, {
          host,
          enableExceptionAutocapture: true,
          flushAt: 1,
          flushInterval: 0,
          requestTimeout: 2000,
          fetchRetryCount: 0,
        })

        await posthog.withContext({ distinctId, sessionId: sessionId ?? undefined }, async () => {
          posthog.capture({
            distinctId,
            event: 'login_succeeded',
          })
        })
        await posthog.shutdown().catch(() => {})
      }
      catch {
        // Analytics failures must not change the login outcome.
      }
    }

    getPostHogLogger()?.emit({
      severityText: 'INFO',
      body: 'Demo authentication login completed',
      attributes: {
        event: 'auth.login.completed',
        outcome: 'success',
        posthog_context_available: Boolean(distinctId),
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
