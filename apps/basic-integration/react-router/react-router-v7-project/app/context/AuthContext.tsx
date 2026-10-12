import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import type { FakeUser } from '~/lib/utils/auth'
import { getCurrentUser, fakeLogin, fakeSignup, fakeLogout } from '~/lib/utils/auth'

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
  const identityChangeId = useRef(0)

  const identifyUser = (authenticatedUser: FakeUser) => {
    const changeId = ++identityChangeId.current

    void import('~/lib/posthog.client').then(({ default: posthog }) => {
      if (identityChangeId.current !== changeId || identifiedUserId.current === authenticatedUser.id) {
        return
      }

      if (identifiedUserId.current) {
        posthog?.reset()
      }

      posthog?.identify(authenticatedUser.id, {
        email: authenticatedUser.email,
        username: authenticatedUser.username,
      })
      identifiedUserId.current = authenticatedUser.id
    })
  }

  const resetIdentity = () => {
    const changeId = ++identityChangeId.current

    void import('~/lib/posthog.client').then(({ default: posthog }) => {
      if (identityChangeId.current !== changeId) return

      posthog?.reset()
      identifiedUserId.current = null
    })
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  useEffect(() => {
    if (user) {
      identifyUser(user)
    } else if (identifiedUserId.current) {
      resetIdentity()
    }
  }, [user])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      identifyUser(loggedInUser)
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      identifyUser(newUser)
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

