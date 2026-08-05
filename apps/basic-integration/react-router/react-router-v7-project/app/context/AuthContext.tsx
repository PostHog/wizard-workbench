import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { FakeUser } from '~/lib/utils/auth'
import { getCurrentUser, setCurrentUser, fakeLogin, fakeSignup, fakeLogout } from '~/lib/utils/auth'

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
)

async function identifyUser(user: FakeUser) {
  if (!isPostHogConfigured) return

  const { default: posthog } = await import('posthog-js')
  posthog.identify(user.id, {
    email: user.email,
    name: user.username,
  })
}

async function resetPostHog() {
  if (!isPostHogConfigured) return

  const { default: posthog } = await import('posthog-js')
  posthog.reset()
}

function syncPostHogIdentity(previousUser: FakeUser | null, nextUser: FakeUser | null) {
  if (previousUser?.id === nextUser?.id) return

  if (previousUser && nextUser) {
    void resetPostHog().then(() => identifyUser(nextUser))
  } else if (nextUser) {
    void identifyUser(nextUser)
  } else if (previousUser) {
    void resetPostHog()
  }
}

interface AuthContextType {
  user: FakeUser | null
  login: (username: string, password: string) => boolean
  signup: (username: string, email: string, password: string) => FakeUser | null
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    syncPostHogIdentity(null, currentUser)
  }, [])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      syncPostHogIdentity(user, loggedInUser)
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      syncPostHogIdentity(user, newUser)
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    syncPostHogIdentity(user, null)
    fakeLogout()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = getCurrentUser()
      syncPostHogIdentity(user, currentUser)
      setUser(currentUser)
    }
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(() => {
      const currentUser = getCurrentUser()
      if (currentUser?.id !== user?.id) {
        syncPostHogIdentity(user, currentUser)
        setUser(currentUser)
      }
    }, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [user?.id])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

