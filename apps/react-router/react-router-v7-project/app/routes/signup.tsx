import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { usePostHog } from '@posthog/react'
import { useAuth } from '~/context/AuthContext'
import type { Route } from './+types/signup'

export default function Signup() {
  const navigate = useNavigate()
  const posthog = usePostHog()
  const { signup } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Fake loading delay
    setTimeout(() => {
      try {
        const newUser = signup(username, email, password)
        setIsLoading(false)

        if (newUser) {
          // Identify the new user in PostHog
          posthog?.identify(newUser.id, {
            username: newUser.username,
            email: newUser.email,
          })

          // Capture signup event
          posthog?.capture('user_signed_up', {
            username: newUser.username,
          })

          navigate('/profile')
        } else {
          setError('Signup failed! (But this is fake, so it should always work)')
        }
      } catch (err) {
        setIsLoading(false)
        posthog?.captureException(err)
        setError('Something went wrong!')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join the Fun!</h1>
          <p className="text-gray-600">Create your fake account</p>
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
              onChange={(e) => {
                const value = e.target.value.trim()
                setUsername(value)
              }}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value.trim()
                setEmail(value)
              }}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="your@email.com (fake)"
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
              placeholder="Any password works!"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Password doesn't matter - it's all fake!
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Sign Up (Fake)'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Login (Fake)
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 text-center">
            🎉 Get started claiming countries, earning points, and unlocking achievements!
            (All fake, but fun!)
          </p>
        </div>
      </div>
    </div>
  )
}

