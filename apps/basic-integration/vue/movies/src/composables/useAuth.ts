import { ref, computed } from 'vue'
import posthog from 'posthog-js'
import { useRouter } from 'vue-router'
import { identifyAuthenticatedUser } from './posthog'

const AUTH_KEY = 'auth-user'

const storedUser = ref<string | null>(localStorage.getItem(AUTH_KEY))

export function useAuth() {
  const router = useRouter()
  const user = computed(() => storedUser.value)
  const isAuthenticated = computed(() => !!storedUser.value)

  const login = async (username: string, password: string) => {
    if (!username?.trim() || !password?.trim()) {
      throw new Error('Username and password are required')
    }

    const sanitizedUsername = username.trim()
    storedUser.value = sanitizedUsername
    localStorage.setItem(AUTH_KEY, sanitizedUsername)

    const distinctId = await identifyAuthenticatedUser(sanitizedUsername)
    posthog.capture('login_submitted', {
      login_method: 'demo_password',
      auth_state: 'authenticated',
      distinct_id_source: 'hashed_username',
    })

    await router.push('/')

    return {
      success: true,
      user: sanitizedUsername,
      distinctId,
    }
  }

  const logout = async () => {
    posthog.capture('logout_clicked', {
      auth_state: 'logged_out',
    })
    posthog.reset()
    storedUser.value = null
    localStorage.removeItem(AUTH_KEY)
    await router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
}
