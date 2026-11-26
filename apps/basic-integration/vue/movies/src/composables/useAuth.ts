import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import posthog from 'posthog-js'

const AUTH_KEY = 'auth-user'
const posthogConfigured = Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST,
)

export function useAuth() {
  const router = useRouter()
  const user = ref<string | null>(localStorage.getItem(AUTH_KEY))
  const isAuthenticated = computed(() => !!user.value)

  const login = async (username: string, password: string) => {
    if (!username?.trim() || !password?.trim()) {
      throw new Error('Username and password are required')
    }

    // Fake auth - accepts any username and password
    const sanitizedUsername = username.trim()
    user.value = sanitizedUsername
    localStorage.setItem(AUTH_KEY, sanitizedUsername)

    if (posthogConfigured) {
      posthog.capture('login_completed')
      posthog.logger.info('user login completed')
    }

    await router.push('/')
    
    return {
      success: true,
      user: sanitizedUsername,
    }
  }

  const logout = async () => {
    if (posthogConfigured) {
      posthog.reset()
    }

    user.value = null
    localStorage.removeItem(AUTH_KEY)
    await router.push('/login')
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    login,
    logout,
  }
}
