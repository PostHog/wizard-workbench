import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import posthog from 'posthog-js'

const AUTH_KEY = 'auth-user'

export function getAnalyticsDistinctId(username: string) {
  let hash = 0
  for (let index = 0; index < username.length; index += 1) {
    hash = (hash * 31 + username.charCodeAt(index)) | 0
  }
  return `viewer_${Math.abs(hash)}`
}

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
    posthog.identify(getAnalyticsDistinctId(sanitizedUsername))
    posthog.capture('user_logged_in')
    
    await router.push('/')
    
    return {
      success: true,
      user: sanitizedUsername,
    }
  }

  const logout = async () => {
    posthog.capture('user_logged_out')
    posthog.reset()
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
