export const useAuth = () => {
  const cookie = useCookie<string | null>('auth-user', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  
  const user = useState<string | null>('auth-user', () => cookie.value)
  const isAuthenticated = computed(() => !!user.value)

  const identifyUser = async (username: string) => {
    if (!import.meta.client)
      return

    const encodedUsername = new TextEncoder().encode(username)
    const digest = await crypto.subtle.digest('SHA-256', encodedUsername)
    const distinctId = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
    const { $posthog } = useNuxtApp()
    $posthog.identify(distinctId, { username })
  }

  if (user.value)
    void identifyUser(user.value)

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
        await identifyUser(response.user)
        useNuxtApp().$posthog.capture('user_logged_in', {
          authentication_method: 'password',
        })
        await navigateTo('/')
      }
      
      return response
    } catch (error: any) {
      throw new Error(error.data?.message || error.message || 'Login failed')
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      useNuxtApp().$posthog.capture('user_logged_out')
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      user.value = null
      cookie.value = null
      useNuxtApp().$posthog.reset()
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
