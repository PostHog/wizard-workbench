import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import type { FakeUser } from '~/lib/utils/auth'
import { getCurrentUser, fakeLogin, fakeSignup, fakeLogout } from '~/lib/utils/auth'

const posthogConfigured = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
)

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
  const identifiedUserId = useRef<string | null>(null)

  const syncAnalyticsIdentity = (nextUser: FakeUser | null) => {
    if (!posthogConfigured) return

    if (!nextUser) {
      if (identifiedUserId.current) {
        window.posthog.reset()
        identifiedUserId.current = null
      }
      return
    }

    if (identifiedUserId.current && identifiedUserId.current !== nextUser.id) {
      window.posthog.reset()
      identifiedUserId.current = null
    }

    if (identifiedUserId.current !== nextUser.id) {
      if (window.posthog.get_distinct_id() !== nextUser.id) {
        window.posthog.identify(nextUser.id, {
          email: nextUser.email,
          name: nextUser.username,
        })
      }
      identifiedUserId.current = nextUser.id
    }
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    syncAnalyticsIdentity(currentUser)
  }, [])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      syncAnalyticsIdentity(loggedInUser)
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      syncAnalyticsIdentity(newUser)
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    fakeLogout()
    syncAnalyticsIdentity(null)
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = getCurrentUser()
      syncAnalyticsIdentity(currentUser)
      setUser(currentUser)
    }
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(() => {
      const currentUser = getCurrentUser()
      if (currentUser?.id !== user?.id) {
        syncAnalyticsIdentity(currentUser)
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

