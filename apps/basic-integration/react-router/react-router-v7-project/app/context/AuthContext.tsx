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

  const identifyUser = (identifiedUser: FakeUser, resetFirst = false) => {
    if (!resetFirst && identifiedUserId.current === identifiedUser.id) return

    identifiedUserId.current = identifiedUser.id
    void import('~/lib/posthog.client').then(({ default: posthog }) => {
      if (resetFirst) posthog?.reset()
      posthog?.identify(identifiedUser.id, {
        email: identifiedUser.email,
        username: identifiedUser.username,
      })
    })
  }

  const resetIdentity = () => {
    identifiedUserId.current = null
    void import('~/lib/posthog.client').then(({ default: posthog }) => {
      posthog?.reset()
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
      identifyUser(loggedInUser, user?.id !== undefined && user.id !== loggedInUser.id)
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      identifyUser(newUser, user?.id !== undefined && user.id !== newUser.id)
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    resetIdentity()
    fakeLogout()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const syncUser = () => {
      const currentUser = getCurrentUser()
      if (currentUser?.id === user?.id) return

      if (currentUser) {
        identifyUser(currentUser, user !== null)
      } else if (user) {
        resetIdentity()
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

