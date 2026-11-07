import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null)
  const posthog = usePostHog()
  const identifiedUserId = useRef<string | null>(null)

  const identifyUser = (currentUser: FakeUser) => {
    if (!posthog || identifiedUserId.current === currentUser.id) return

    posthog.identify(currentUser.id, {
      email: currentUser.email,
      username: currentUser.username,
    })
    identifiedUserId.current = currentUser.id
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      identifyUser(currentUser)
    }
  }, [posthog])

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
    posthog?.reset()
    identifiedUserId.current = null
    fakeLogout()
    setUser(null)
  }

  // Sync user state when localStorage changes
  useEffect(() => {
    const syncUser = () => {
      const currentUser = getCurrentUser()
      if (currentUser?.id === user?.id) return

      if (currentUser) {
        if (identifiedUserId.current && identifiedUserId.current !== currentUser.id) {
          posthog?.reset()
          identifiedUserId.current = null
        }
        identifyUser(currentUser)
      } else {
        posthog?.reset()
        identifiedUserId.current = null
      }
      setUser(currentUser)
    }

    window.addEventListener('storage', syncUser)
    const interval = setInterval(syncUser, 1000)
    
    return () => {
      window.removeEventListener('storage', syncUser)
      clearInterval(interval)
    }
  }, [posthog, user?.id])

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

