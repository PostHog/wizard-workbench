export function useAuth() {
  const posthog = usePostHog()
  const cookie = useCookie<string | null>('auth-user', {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const user = useState<string | null>('auth-user', () => cookie.value)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (username: string, password: string) => {
    if (!username?.trim() || !password?.trim()) {
      throw new Error('Username and password are required')
    }

    try {
      const response = await $fetch<{ success: boolean, user: string }>('/api/auth/login', {
        method: 'POST',
        body: { username: username.trim(), password },
      })

      if (response.success) {
        user.value = response.user
        cookie.value = response.user
        posthog?.identify(response.user, {
          username: response.user,
        })
        posthog?.capture('login_succeeded', {
          auth_method: 'password',
          login_destination: '/',
        })
        await navigateTo('/')
      }

      return response
    }
    catch (error: any) {
      throw new Error(error.data?.message || error.message || 'Login failed')
    }
  }

  const logout = async () => {
    const currentUser = user.value

    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    }
    catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
      posthog?.captureException(error)
    }
    finally {
      if (currentUser) {
        posthog?.capture('logout_completed', {
          had_active_session: true,
          logout_destination: '/login',
        })
      }
      posthog?.reset()
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
