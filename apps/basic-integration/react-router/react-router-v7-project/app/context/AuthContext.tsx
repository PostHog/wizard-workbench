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

  const identifyUser = (identifiedUser: FakeUser) => {
    if (identifiedUserId.current && identifiedUserId.current !== identifiedUser.id) {
      posthog?.reset()
    }

    posthog?.identify(identifiedUser.id, {
      email: identifiedUser.email,
      username: identifiedUser.username,
    })
    identifiedUserId.current = identifiedUser.id
  }

  const resetIdentity = () => {
    if (identifiedUserId.current) {
      posthog?.reset()
      identifiedUserId.current = null
    }
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
      identifyUser(loggedInUser)
      posthog?.capture('user_logged_in')
      posthog?.logger.info('user_login_completed', {
        authentication_method: 'local',
      })
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = (username: string, email: string, password: string): FakeUser | null => {
    try {
      const newUser = fakeSignup(username, email, password)
      identifyUser(newUser)
      posthog?.capture('user_signed_up')
      posthog?.logger.info('user_signup_completed', {
        authentication_method: 'local',
      })
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      return null
    }
  }

  const logout = () => {
    posthog?.capture('user_logged_out')
    posthog?.logger.info('user_logout_completed', {
      authentication_method: 'local',
    })
    resetIdentity()
    fakeLogout()
    setUser(null)
  }

  // Sync user state and analytics identity when localStorage changes in another tab.
  useEffect(() => {
    const syncCurrentUser = () => {
      const currentUser = getCurrentUser()

      if (currentUser?.id !== identifiedUserId.current) {
        if (currentUser) {
          identifyUser(currentUser)
        } else {
          resetIdentity()
        }
      }

      setUser(currentUser)
    }

    window.addEventListener('storage', syncCurrentUser)
    const interval = setInterval(syncCurrentUser, 1000)
    
    return () => {
      window.removeEventListener('storage', syncCurrentUser)
      clearInterval(interval)
    }
  }, [posthog])

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

