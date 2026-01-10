import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { usePostHog } from '@posthog/react'
import { useAuth } from '~/context/AuthContext'
import { getCurrentUser } from '~/lib/utils/auth'
import type { Route } from './+types/login'

export default function Login() {
  const navigate = useNavigate()
  const posthog = usePostHog()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Fake loading delay for realism
    setTimeout(() => {
      const success = login(username, password)
      setIsLoading(false)

      if (success) {
        // Get the logged in user to identify them
        const loggedInUser = getCurrentUser()
        if (loggedInUser) {
          // Identify the user in PostHog
          posthog?.identify(loggedInUser.id, {
            username: loggedInUser.username,
            email: loggedInUser.email,
          })
        }

        // Capture login event
        posthog?.capture('user_logged_in', {
          username: username,
        })

        navigate('/profile')
      } else {
        // Capture login failed event
        posthog?.capture('login_failed', {
          username: username,
        })

        setError('Invalid credentials! (But this is fake, so any password works if the username exists)')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Login to your fake account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter any password (it's fake!)"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Hint: Any password works! This is fake authentication.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login (Fake)'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
              Sign up (Fake)
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 text-center">
            ⚠️ This is a fake authentication system. All data is stored in localStorage.
            No real authentication happens here!
          </p>
        </div>
      </div>
    </div>
  )
}

