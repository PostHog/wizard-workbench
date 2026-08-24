import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import type { FakeUser } from '~/lib/utils/auth'
import { getCurrentUser, setCurrentUser, fakeLogin, fakeSignup, fakeLogout } from '~/lib/utils/auth'

function isPostHogConfigured() {
  return Boolean(
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  )
}

function identifyUser(user: FakeUser) {
  if (!isPostHogConfigured()) return

  void import('posthog-js').then(({ default: posthog }) => {
    posthog.identify(user.id, {
      email: user.email,
      username: user.username,
    })
  })
}

function capturePostHog(event: 'user_logged_in' | 'user_signed_up') {
  if (!isPostHogConfigured()) return

  void import('posthog-js').then(({ default: posthog }) => {
    posthog.capture(event)
  })
}

function captureLogoutAndResetPostHog() {
  if (!isPostHogConfigured()) return

  void import('posthog-js').then(({ default: posthog }) => {
    posthog.capture('user_logged_out')
    posthog.reset()
  })
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
  const identifiedUserId = useRef<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser && identifiedUserId.current !== currentUser.id) {
      identifiedUserId.current = currentUser.id
      identifyUser(currentUser)
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      identifiedUserId.current = loggedInUser.id
      identifyUser(loggedInUser)
      capturePostHog('user_logged_in')
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      identifiedUserId.current = newUser.id
      identifyUser(newUser)
      capturePostHog('user_signed_up')
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    captureLogoutAndResetPostHog()
    identifiedUserId.current = null
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

