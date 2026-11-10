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

function identifyUser(user: FakeUser) {
  window.dispatchEvent(
    new CustomEvent('posthog:identify-user', {
      detail: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    }),
  )
}

function resetUserIdentity() {
  window.dispatchEvent(new Event('posthog:reset-user'))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null)
  const identifiedUserId = useRef<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  useEffect(() => {
    if (user) {
      if (identifiedUserId.current !== user.id) {
        if (identifiedUserId.current) {
          resetUserIdentity()
        }
        identifyUser(user)
        identifiedUserId.current = user.id
      }
    } else if (identifiedUserId.current) {
      resetUserIdentity()
      identifiedUserId.current = null
    }
  }, [user])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      if (identifiedUserId.current && identifiedUserId.current !== loggedInUser.id) {
        resetUserIdentity()
      }
      identifyUser(loggedInUser)
      identifiedUserId.current = loggedInUser.id
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      if (identifiedUserId.current && identifiedUserId.current !== newUser.id) {
        resetUserIdentity()
      }
      identifyUser(newUser)
      identifiedUserId.current = newUser.id
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    if (identifiedUserId.current) {
      resetUserIdentity()
      identifiedUserId.current = null
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

