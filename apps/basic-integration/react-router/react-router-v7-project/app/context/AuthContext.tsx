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

function identifyPostHogUser(user: FakeUser) {
  window.dispatchEvent(
    new CustomEvent('posthog_identify_user', {
      detail: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    }),
  )
}

function resetPostHogUser() {
  window.dispatchEvent(new Event('posthog_reset_user'))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      identifyPostHogUser(currentUser)
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const loggedInUser = fakeLogin(username, password)
    if (loggedInUser) {
      if (user && user.id !== loggedInUser.id) {
        resetPostHogUser()
      }
      identifyPostHogUser(loggedInUser)
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      if (user && user.id !== newUser.id) {
        resetPostHogUser()
      }
      identifyPostHogUser(newUser)
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    resetPostHogUser()
    fakeLogout()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = getCurrentUser()
      if (currentUser?.id !== user?.id) {
        if (user) {
          resetPostHogUser()
        }
        if (currentUser) {
          identifyPostHogUser(currentUser)
        }
        setUser(currentUser)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(() => {
      const currentUser = getCurrentUser()
      if (currentUser?.id !== user?.id) {
        if (user) {
          resetPostHogUser()
        }
        if (currentUser) {
          identifyPostHogUser(currentUser)
        }
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

