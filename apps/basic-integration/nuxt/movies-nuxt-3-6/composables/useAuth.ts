export function useAuth() {
  const cookie = useCookie<string | null>('auth-user', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const { $posthog } = useNuxtApp()
  const user = useState<string | null>('auth-user', () => cookie.value)
  const isAuthenticated = computed(() => !!user.value)

  if (import.meta.client && user.value)
    $posthog?.identify(user.value)

  async function login(username: string, password: string) {
    if (!username?.trim() || !password?.trim())
      throw new Error('Username and password are required')

    try {
      const response = await $fetch<{ success: boolean; user: string }>('/api/auth/login', {
        method: 'POST',
        body: { username: username.trim(), password },
      })

      if (response.success) {
        user.value = response.user
        cookie.value = response.user
        $posthog?.identify(response.user)
        $posthog?.capture('login_succeeded', {
          authentication_method: 'password',
          auth_state: 'authenticated',
        })
        await navigateTo('/')
      }

      return response
    }
    catch (error: any) {
      throw new Error(error.data?.message || error.message || 'Login failed')
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    }
    catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    }
    finally {
      $posthog?.reset()
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
