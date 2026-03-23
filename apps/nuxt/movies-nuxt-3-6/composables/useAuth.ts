export function useAuth() {
  const cookie = useCookie<string | null>('auth-user', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const user = useState<string | null>('auth-user', () => cookie.value)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (username: string, password: string) => {
    if (!username?.trim() || !password?.trim())
      throw new Error('Username and password are required')

    try {
      const { $posthog } = useNuxtApp()
      const posthog = $posthog?.()
      const distinctId = posthog?.get_distinct_id()
      const sessionId = posthog?.get_session_id()

      const response = await $fetch<{ success: boolean; user: string }>('/api/auth/login', {
        method: 'POST',
        body: { username: username.trim(), password },
        headers: {
          ...(distinctId ? { 'X-POSTHOG-DISTINCT-ID': distinctId } : {}),
          ...(sessionId ? { 'X-POSTHOG-SESSION-ID': sessionId } : {}),
        },
      })

      if (response.success) {
        user.value = response.user
        cookie.value = response.user

        if (posthog) {
          posthog.identify(response.user, { username: response.user })
          posthog.capture('user_logged_in', { username: response.user })
        }

        await navigateTo('/')
      }

      return response
    }
    catch (error: any) {
      throw new Error(error.data?.message || error.message || 'Login failed')
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    }
    catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    }
    finally {
      const { $posthog } = useNuxtApp()
      const posthog = $posthog?.()
      if (posthog) {
        posthog.capture('user_logged_out')
        posthog.reset()
      }

      user.value = null
      cookie.value = null
      await navigateTo('/login')
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
  }
}
