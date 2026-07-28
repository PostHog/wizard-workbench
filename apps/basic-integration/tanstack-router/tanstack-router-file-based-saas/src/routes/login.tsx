import { createFileRoute, useRouter } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'
import * as React from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginComponent,
})

function LoginComponent() {
  const router = useRouter()
  const posthog = usePostHog()
  const { auth, status } = Route.useRouteContext({
    select: ({ auth }) => ({ auth, status: auth.status }),
  })
  const search = Route.useSearch()
  const [username, setUsername] = React.useState('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    auth.login(username)
    posthog.capture('user_logged_in')
    router.invalidate()
  }

  React.useLayoutEffect(() => {
    if (status === 'loggedIn' && search.redirect) {
      router.history.push(search.redirect)
    }
  }, [status, search.redirect])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CF</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {status === 'loggedIn' ? 'Welcome back!' : 'Sign in to CloudFlow'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {status === 'loggedIn'
              ? 'You are currently signed in.'
              : 'Enter your credentials to access your account.'}
          </p>
        </div>

        {status === 'loggedIn' ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <p className="text-lg mb-1">Signed in as</p>
            <p className="text-xl font-semibold mb-6">{auth.username}</p>
            <button
              onClick={() => {
                auth.logout()
                router.invalidate()
              }}
              className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Demo: Enter any username to sign in
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
