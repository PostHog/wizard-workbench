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
  const identifiedUserId = useRef<string | null>(null)

  const identifyUser = (user: FakeUser, event?: 'user_logged_in' | 'user_signed_up') => {
    if (!import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN || !import.meta.env.VITE_PUBLIC_POSTHOG_HOST) {
      return
    }

    if (identifiedUserId.current === user.id) {
      if (event) {
        void import('posthog-js').then(({ default: posthog }) => {
          posthog.capture(event)
        })
      }
      return
    }

    identifiedUserId.current = user.id
    void import('posthog-js').then(({ default: posthog }) => {
      posthog.identify(user.id, {
        email: user.email,
        username: user.username,
      })
      if (event) posthog.capture(event)
    })
  }

  const resetUserIdentity = (event?: 'user_logged_out') => {
    if (!identifiedUserId.current) return

    identifiedUserId.current = null
    if (!import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN || !import.meta.env.VITE_PUBLIC_POSTHOG_HOST) {
      return
    }

    void import('posthog-js').then(({ default: posthog }) => {
      if (event) posthog.capture(event)
      posthog.reset()
    })
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) identifyUser(currentUser)
  }, [])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      setUser(loggedInUser)
      identifyUser(loggedInUser, 'user_logged_in')
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      setUser(newUser)
      identifyUser(newUser, 'user_signed_up')
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    resetUserIdentity('user_logged_out')
    fakeLogout()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const syncUser = () => {
      const currentUser = getCurrentUser()
      if (currentUser?.id !== identifiedUserId.current) {
        resetUserIdentity()
        if (currentUser) identifyUser(currentUser)
      }
      setUser(currentUser)
    }

    window.addEventListener('storage', syncUser)
    const interval = setInterval(() => {
      const currentUser = getCurrentUser()
      if (currentUser?.id !== user?.id) {
        syncUser()
      }
    }, 1000)
    
    return () => {
      window.removeEventListener('storage', syncUser)
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

