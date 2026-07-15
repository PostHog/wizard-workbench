async function getPostHogDistinctId(userId: string) {
  const data = new TextEncoder().encode(userId)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
  return `user_${hash}`
}

export const useAuth = () => {
  const cookie = useCookie<string | null>('auth-user', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  
  const user = useState<string | null>('auth-user', () => cookie.value)
  const isAuthenticated = computed(() => !!user.value)
  const { $posthog: posthog } = useNuxtApp()

  if (import.meta.client && user.value) {
    getPostHogDistinctId(user.value).then(distinctId => posthog.identify(distinctId))
  }

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
        const distinctId = await getPostHogDistinctId(response.user)
        posthog.identify(distinctId)
        posthog.capture('user_logged_in')
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
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      posthog.capture('user_logged_out')
      posthog.reset()
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
