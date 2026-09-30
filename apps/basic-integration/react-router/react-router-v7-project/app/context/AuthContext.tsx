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

function syncAnalyticsIdentity(nextUser: FakeUser | null, previousUser: FakeUser | null) {
  if (typeof window === 'undefined') return

  if (!nextUser) {
    if (previousUser) {
      window.dispatchEvent(new CustomEvent('posthog:reset'))
    }
    return
  }

  if (previousUser && previousUser.id !== nextUser.id) {
    window.dispatchEvent(new CustomEvent('posthog:reset'))
  }

  window.dispatchEvent(new CustomEvent('posthog:identify_user', { detail: nextUser }))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      syncAnalyticsIdentity(loggedInUser, user)
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      syncAnalyticsIdentity(newUser, user)
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    fakeLogout()
    syncAnalyticsIdentity(null, user)
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const syncStoredUser = () => {
      const currentUser = getCurrentUser()
      if (currentUser?.id !== user?.id) {
        syncAnalyticsIdentity(currentUser, user)
        setUser(currentUser)
      }
    }
    window.addEventListener('storage', syncStoredUser)
    const interval = setInterval(syncStoredUser, 1000)
    
    return () => {
      window.removeEventListener('storage', syncStoredUser)
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

