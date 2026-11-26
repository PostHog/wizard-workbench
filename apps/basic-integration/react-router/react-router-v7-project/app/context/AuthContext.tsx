import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { usePostHog } from '@posthog/react'
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
const posthogConfigured = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null)
  const posthog = usePostHog()

  const identifyUser = (currentUser: FakeUser) => {
    if (!posthogConfigured) return

    posthog?.identify(currentUser.id, {
      email: currentUser.email,
      username: currentUser.username,
    })
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      identifyUser(currentUser)
    }
    setUser(currentUser)
  }, [posthog])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      identifyUser(loggedInUser)
      if (posthogConfigured) {
        posthog?.capture('user_logged_in')
        posthog?.logger.info('user login completed')
      }
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      identifyUser(newUser)
      if (posthogConfigured) {
        posthog?.capture('user_signed_up')
        posthog?.logger.info('user signup completed')
      }
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    if (posthogConfigured) {
      posthog?.capture('user_logged_out')
      posthog?.logger.info('user logout completed')
      posthog?.reset()
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

