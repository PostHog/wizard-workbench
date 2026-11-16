import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
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

const isPostHogConfigured = () =>
  typeof window !== 'undefined' &&
  Boolean(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN) &&
  Boolean(import.meta.env.VITE_PUBLIC_POSTHOG_HOST)

const identifyUser = (user: FakeUser) => {
  if (!isPostHogConfigured()) return

  void import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.identify(user.id, {
        email: user.email,
        name: user.username,
      })
    })
    .catch(() => undefined)
}

const resetPostHog = () => {
  if (!isPostHogConfigured()) return

  void import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.reset()
    })
    .catch(() => undefined)
}

const resetAndIdentifyUser = (user: FakeUser) => {
  if (!isPostHogConfigured()) return

  void import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.reset()
      posthog.identify(user.id, {
        email: user.email,
        name: user.username,
      })
    })
    .catch(() => undefined)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      identifyUser(currentUser)
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      setUser(loggedInUser)
      if (user && loggedInUser.id !== user.id) {
        resetAndIdentifyUser(loggedInUser)
      } else {
        identifyUser(loggedInUser)
      }
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      setUser(newUser)
      if (user && newUser.id !== user.id) {
        resetAndIdentifyUser(newUser)
      } else {
        identifyUser(newUser)
      }
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    resetPostHog()
    fakeLogout()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const syncUser = () => {
      const currentUser = getCurrentUser()

      if (currentUser?.id !== user?.id) {
        if (user && currentUser) {
          resetAndIdentifyUser(currentUser)
        } else if (user) {
          resetPostHog()
        } else if (currentUser) {
          identifyUser(currentUser)
        }
        setUser(currentUser)
      }
    }

    window.addEventListener('storage', syncUser)
    const interval = setInterval(syncUser, 1000)
    
    return () => {
      window.removeEventListener('storage', syncUser)
      clearInterval(interval)
    }
  }, [user])

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

