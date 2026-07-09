import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import posthog from 'posthog-js'

const AUTH_KEY = 'auth-user'

function getDistinctId(username: string) {
  return `demo_user_${username.trim().toLowerCase()}`
}

export function useAuth() {
  const router = useRouter()
  const user = ref<string | null>(localStorage.getItem(AUTH_KEY))
  const isAuthenticated = computed(() => !!user.value)

  if (user.value) {
    posthog.identify(getDistinctId(user.value), {
      auth_state: 'authenticated',
      auth_method: 'demo_credentials',
    })
  }

  const login = async (username: string, password: string) => {
    if (!username?.trim() || !password?.trim()) {
      throw new Error('Username and password are required')
    }

    // Fake auth - accepts any username and password
    const sanitizedUsername = username.trim()
    user.value = sanitizedUsername
    localStorage.setItem(AUTH_KEY, sanitizedUsername)

    posthog.identify(getDistinctId(sanitizedUsername), {
      auth_state: 'authenticated',
      auth_method: 'demo_credentials',
    })
    posthog.capture('user_logged_in', {
      auth_method: 'demo_credentials',
      destination: 'home',
    })

    await router.push('/')

    return {
      success: true,
      user: sanitizedUsername,
    }
  }

  const logout = async () => {
    user.value = null
    localStorage.removeItem(AUTH_KEY)
    posthog.reset()
    await router.push('/login')
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    login,
    logout,
  }
}
