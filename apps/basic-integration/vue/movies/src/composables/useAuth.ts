import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import posthog from 'posthog-js'

const AUTH_KEY = 'auth-user'

export function useAuth() {
  const router = useRouter()
  const user = ref<string | null>(localStorage.getItem(AUTH_KEY))
  const isAuthenticated = computed(() => !!user.value)

  if (user.value) {
    posthog.identify(user.value, {
      username: user.value,
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

    posthog.identify(sanitizedUsername, {
      username: sanitizedUsername,
    })
    posthog.capture('user_logged_in', {
      authentication_method: 'demo_credentials',
    })

    await router.push('/')

    return {
      success: true,
      user: sanitizedUsername,
    }
  }

  const logout = async () => {
    const currentUser = user.value

    if (currentUser) {
      posthog.capture('user_logged_out', {
        authentication_method: 'demo_credentials',
      })
    }

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
