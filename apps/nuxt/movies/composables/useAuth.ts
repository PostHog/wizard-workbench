export const useAuth = () => {
  // Initialize from cookie if available
  const cookie = useCookie<string | null>('auth-user')
  const user = useState<string | null>('auth-user', () => cookie.value)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (username: string, password: string) => {
    // Fake auth - accepts any username/password
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    })
    
    if (response.success) {
      user.value = username
      cookie.value = username
      await navigateTo('/')
    }
    
    return response
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    })
    user.value = null
    cookie.value = null
    await navigateTo('/login')
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
  }
}
