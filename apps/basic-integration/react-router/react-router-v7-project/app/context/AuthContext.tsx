import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { FakeUser } from '~/lib/utils/auth'
import { getCurrentUser, fakeLogin, fakeSignup, fakeLogout } from '~/lib/utils/auth'
import posthog, { isPostHogConfigured } from '~/lib/posthog.client'

function identifyUser(user: FakeUser): void {
  if (isPostHogConfigured) {
    posthog.identify(user.id, {
      email: user.email,
      username: user.username,
    })
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
    if (currentUser) {
      identifyUser(currentUser)
    }
    setUser(currentUser)
  }, [])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      identifyUser(loggedInUser)
      if (isPostHogConfigured) {
        posthog.capture('login_completed')
      }
      setUser(loggedInUser)
      return true
    }
    if (isPostHogConfigured) {
      posthog.capture('login_failed')
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      identifyUser(newUser)
      if (isPostHogConfigured) {
        posthog.capture('signup_completed')
      }
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      if (isPostHogConfigured) {
        posthog.capture('signup_failed')
      }
      return null
    }
  }

  const logout = () => {
    if (isPostHogConfigured) {
      posthog.capture('logout_completed')
      posthog.reset()
    }
    fakeLogout()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = getCurrentUser()
      setUser(currentUser)
    }
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(() => {
      const currentUser = getCurrentUser()
      if (currentUser?.id !== user?.id) {
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

