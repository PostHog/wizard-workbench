import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import type { FakeUser } from '~/lib/utils/auth'
import { getCurrentUser, setCurrentUser, fakeLogin, fakeSignup, fakeLogout } from '~/lib/utils/auth'

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
  const analyticsUserId = useRef<string | null>(null)
  const analyticsQueue = useRef<Promise<void>>(Promise.resolve())

  const queueAnalytics = (action: (posthog: typeof import('posthog-js').default) => void) => {
    if (
      typeof window === 'undefined' ||
      !import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
      !import.meta.env.VITE_PUBLIC_POSTHOG_HOST
    ) {
      return
    }

    analyticsQueue.current = analyticsQueue.current
      .then(() => import('posthog-js'))
      .then(({ default: posthog }) => action(posthog))
      .catch((error: unknown) => {
        console.error('PostHog identity update failed:', error)
      })
  }

  const identifyUser = (identifiedUser: FakeUser) => {
    if (analyticsUserId.current === identifiedUser.id) return

    const previousUserId = analyticsUserId.current
    analyticsUserId.current = identifiedUser.id
    queueAnalytics((posthog) => {
      if (previousUserId) {
        posthog.reset()
      }
      posthog.identify(identifiedUser.id, {
        email: identifiedUser.email,
        username: identifiedUser.username,
      })
    })
  }

  const resetAnalytics = () => {
    analyticsUserId.current = null
    queueAnalytics((posthog) => posthog.reset())
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      identifyUser(currentUser)
    }
    setUser(currentUser)
  }, [])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      identifyUser(loggedInUser)
      queueAnalytics((posthog) => {
        posthog.capture('user_logged_in')
        posthog.logger.info('User login completed')
      })
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      identifyUser(newUser)
      queueAnalytics((posthog) => {
        posthog.capture('user_signed_up')
        posthog.logger.info('User signup completed')
      })
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    queueAnalytics((posthog) => {
      posthog.capture('user_logged_out')
      posthog.logger.info('User logout completed')
    })
    fakeLogout()
    resetAnalytics()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const syncCurrentUser = () => {
      const currentUser = getCurrentUser()
      if (currentUser?.id === user?.id) return

      if (currentUser) {
        identifyUser(currentUser)
      } else {
        resetAnalytics()
      }
      setUser(currentUser)
    }

    window.addEventListener('storage', syncCurrentUser)
    const interval = setInterval(syncCurrentUser, 1000)
    
    return () => {
      window.removeEventListener('storage', syncCurrentUser)
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

