import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { usePostHog } from 'posthog-js/react'
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
const isPostHogConfigured = Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST,
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null)
  const posthog = usePostHog()

  const identifyUser = (identifiedUser: FakeUser) => {
    if (!isPostHogConfigured) return

    posthog?.identify(identifiedUser.id, {
      email: identifiedUser.email,
      username: identifiedUser.username,
    })
  }

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
      if (isPostHogConfigured && user && user.id !== loggedInUser.id) {
        posthog?.reset()
      }
      identifyUser(loggedInUser)
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      if (isPostHogConfigured && user && user.id !== newUser.id) {
        posthog?.reset()
      }
      identifyUser(newUser)
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    if (isPostHogConfigured) {
      posthog?.reset()
    }
    fakeLogout()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const syncUser = () => {
      const currentUser = getCurrentUser()
      if (currentUser?.id === user?.id) return

      if (isPostHogConfigured && user) {
        posthog?.reset()
      }
      if (currentUser) {
        identifyUser(currentUser)
      }
      setUser(currentUser)
    }

    window.addEventListener('storage', syncUser)
    const interval = setInterval(syncUser, 1000)
    
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

