export function useAuth() {
  const cookie = useCookie<string | null>('auth-user', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const user = useState<string | null>('auth-user', () => cookie.value)
  const isAuthenticated = computed(() => !!user.value)

  const getPostHogHeaders = (): Record<string, string> => {
    if (!process.client)
      return {}
    try {
      const { $posthog } = useNuxtApp()
      if (!$posthog)
        return {}
      return {
        'x-posthog-distinct-id': ($posthog as any).get_distinct_id?.() || '',
        'x-posthog-session-id': ($posthog as any).get_session_id?.() || '',
      }
    }
    catch {
      return {}
    }
  }

  const login = async (username: string, password: string) => {
    if (!username?.trim() || !password?.trim())
      throw new Error('Username and password are required')

    try {
      const response = await $fetch<{ success: boolean; user: string }>('/api/auth/login', {
        method: 'POST',
        body: { username: username.trim(), password },
        headers: getPostHogHeaders(),
      })

      if (response.success) {
        user.value = response.user
        cookie.value = response.user
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
      await $fetch('/api/auth/logout', { method: 'POST', headers: getPostHogHeaders() })
    }
    catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    }
    finally {
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
