import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import type { PostHog } from 'posthog-js'
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

function identifyUser(posthog: PostHog | undefined, user: FakeUser, resetBeforeIdentify = false) {
  if (!posthog) return

  if (resetBeforeIdentify) {
    posthog.reset()
  }

  posthog.identify(user.id, {
    email: user.email,
    username: user.username,
  })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const posthog = usePostHog()
  const [user, setUser] = useState<FakeUser | null>(null)
  const hasIdentifiedStoredUser = useRef(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser && !hasIdentifiedStoredUser.current) {
      hasIdentifiedStoredUser.current = true
      identifyUser(posthog, currentUser)
    }
  }, [posthog])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      setUser(loggedInUser)
      identifyUser(posthog, loggedInUser, Boolean(user && user.id !== loggedInUser.id))
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      setUser(newUser)
      identifyUser(posthog, newUser, Boolean(user && user.id !== newUser.id))
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    posthog?.reset()
    fakeLogout()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const syncUser = () => {
      const currentUser = getCurrentUser()
      if (currentUser?.id === user?.id) {
        return
      }

      if (currentUser) {
        identifyUser(posthog, currentUser, Boolean(user))
      } else if (user) {
        posthog?.reset()
      }
      setUser(currentUser)
    }

    window.addEventListener('storage', syncUser)
    const interval = setInterval(syncUser, 1000)
    
    return () => {
      window.removeEventListener('storage', syncUser)
      clearInterval(interval)
    }
  }, [posthog, user])

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

