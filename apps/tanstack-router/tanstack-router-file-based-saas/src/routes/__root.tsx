import * as React from 'react'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { PostHogProvider } from 'posthog-js/react'
import { Spinner } from '../components/Spinner'
import { Breadcrumbs } from '../components/Breadcrumbs'
import type { Auth } from '../utils/auth'

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' })
  return <Spinner show={isLoading} />
}

export const Route = createRootRouteWithContext<{
  auth: Auth
}>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY!}
      options={{
        api_host: '/ingest',
        ui_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
        capture_exceptions: true,
        debug: import.meta.env.DEV,
      }}
    >
      <div className={`min-h-screen flex flex-col`}>
        <div className={`flex items-center border-b gap-2 bg-white dark:bg-gray-800 shadow-sm`}>
          <div className={`flex items-center gap-2 p-3`}>
            <div className={`w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}>
              <span className={`text-white font-bold text-sm`}>CF</span>
            </div>
            <h1 className={`text-xl font-semibold`}>CloudFlow</h1>
          </div>
          <Breadcrumbs />
          <div className={`flex-1`} />
          <div className={`text-xl pr-4`}>
            <RouterSpinner />
          </div>
        </div>
        <div className={`flex-1 flex`}>
          <div className={`w-56 bg-gray-50 dark:bg-gray-800/50 border-r`}>
            <nav className={`p-2 space-y-1`}>
              {(
                [
                  ['/', 'Home', '🏠'],
                  ['/dashboard', 'Dashboard', '📊'],
                  ['/profile', 'Account', '👤'],
                  ['/login', 'Sign In', '🔐'],
                ] as const
              ).map(([to, label, icon]) => {
                return (
                  <Link
                    key={to}
                    to={to}
                    preload="intent"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                    activeProps={{ className: `bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium` }}
                  >
                    <span>{icon}</span>
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className={`flex-1 bg-white dark:bg-gray-900`}>
            <Outlet />
          </div>
        </div>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </PostHogProvider>
  )
}
