import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import posthog from 'posthog-js'
import type { FakeUser } from '~/lib/utils/auth'
import { getCurrentUser, fakeLogin, fakeSignup, fakeLogout } from '~/lib/utils/auth'
import { getPostHogPersonProperties } from '~/lib/posthog-utils'

interface AuthContextType {
  user: FakeUser | null
  login: (username: string, password: string) => FakeUser | null
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

    if (currentUser) {
      posthog.identify(currentUser.id, getPostHogPersonProperties(currentUser))
    }
  }, [])

  const login = (username: string, password: string): FakeUser | null => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      setUser(loggedInUser)
      posthog.identify(loggedInUser.id, getPostHogPersonProperties(loggedInUser))
      return loggedInUser
    }
    return null
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      setUser(newUser)
      posthog.identify(newUser.id, getPostHogPersonProperties(newUser))
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      posthog.captureException(error)
      return null
    }
  }

  const logout = () => {
    fakeLogout()
    posthog.reset()
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

