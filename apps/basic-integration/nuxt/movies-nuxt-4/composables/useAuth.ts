export function useAuth() {
  const posthog = usePostHog()
  const cookie = useCookie<string | null>('auth-user', {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const userIdCookie = useCookie<string | null>('auth-user-id', {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  })
  const user = useState<string | null>('auth-user', () => cookie.value)
  const userId = useState<string | null>('auth-user-id', () => userIdCookie.value)
  const isAuthenticated = computed(() => !!user.value)

  if (userId.value)
    posthog?.identify(userId.value)

  const login = async (username: string, password: string) => {
    if (!username?.trim() || !password?.trim()) {
      throw new Error('Username and password are required')
    }

    try {
      const response = await $fetch<{ success: boolean, user: string, userId: string }>('/api/auth/login', {
        method: 'POST',
        body: { username: username.trim(), password },
        headers: {
          'X-POSTHOG-DISTINCT-ID': posthog?.get_distinct_id() || '',
          'X-POSTHOG-SESSION-ID': posthog?.get_session_id() || '',
        },
      })

      if (response.success) {
        posthog?.identify(response.userId)
        posthog?.capture('user_logged_in')
        user.value = response.user
        userId.value = response.userId
        cookie.value = response.user
        userIdCookie.value = response.userId
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
      await $fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'X-POSTHOG-DISTINCT-ID': posthog?.get_distinct_id() || '',
          'X-POSTHOG-SESSION-ID': posthog?.get_session_id() || '',
        },
      })
    }
    catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    }
    finally {
      posthog?.capture('user_logged_out')
      posthog?.reset()
      user.value = null
      userId.value = null
      cookie.value = null
      userIdCookie.value = null
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
