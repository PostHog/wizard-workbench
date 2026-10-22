export const useAuth = () => {
  const cookie = useCookie<string | null>('auth-user', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
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
      const response = await $fetch<{ success: boolean; user: string }>('/api/auth/login', {
        method: 'POST',
        body: { username: username.trim(), password },
      })
      
      if (response.success) {
        user.value = response.user
        cookie.value = response.user

        if (process.client) {
          const { $posthog } = useNuxtApp()
          $posthog?.identify(response.user)
          $posthog?.capture('user_logged_in')
          $posthog?.logger.info('user login completed', {
            authentication_method: 'password',
          })
        }

        await navigateTo('/')
      }
      
      return response
    } catch (error: any) {
      throw new Error(error.data?.message || error.message || 'Login failed')
    }
  }

  const logout = async () => {
    let logoutRequestFailed = false

    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      logoutRequestFailed = true
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      if (process.client) {
        const { $posthog } = useNuxtApp()
        $posthog?.capture('user_logged_out')
        $posthog?.logger.info('user logout completed', {
          logout_request_failed: logoutRequestFailed,
        })
        $posthog?.reset()
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
