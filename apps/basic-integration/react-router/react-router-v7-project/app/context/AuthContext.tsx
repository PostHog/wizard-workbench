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
    username: user.username,
  })
}

async function resetPostHog() {
  if (!isPostHogConfigured) return

  const { default: posthog } = await import('posthog-js')
  posthog.reset()
}

interface AuthContextType {
  user: FakeUser | null
  login: (username: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string) => Promise<FakeUser | null>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      void identifyUser(currentUser)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      if (user && user.id !== loggedInUser.id) {
        await resetPostHog()
      }
      await identifyUser(loggedInUser)
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = async (username: string, email: string, password: string): Promise<FakeUser | null> => {
    try {
      const newUser = fakeSignup(username, email, password)
      if (user && user.id !== newUser.id) {
        await resetPostHog()
      }
      await identifyUser(newUser)
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = async () => {
    await resetPostHog()
    fakeLogout()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const syncUser = async () => {
      const currentUser = getCurrentUser()
      if (currentUser?.id === user?.id) return

      if (user) {
        await resetPostHog()
      }
      if (currentUser) {
        await identifyUser(currentUser)
      }
      setUser(currentUser)
    }

    const handleStorageChange = () => {
      void syncUser()
    }

    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(() => {
      void syncUser()
    }, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
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

