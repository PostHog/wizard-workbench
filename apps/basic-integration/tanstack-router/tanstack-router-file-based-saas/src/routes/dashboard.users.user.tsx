import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { z } from 'zod'
import { usePostHog } from '@posthog/react'
import { fetchUserById } from '../utils/mockTodos'

const roles = ['Admin', 'Member', 'Viewer', 'Editor', 'Manager']

export const Route = createFileRoute('/dashboard/users/user')({
  validateSearch: z.object({
    userId: z.number(),
  }),
  loaderDeps: ({ search: { userId } }) => ({ userId }),
  loader: async ({ deps: { userId } }) => {
    const user = await fetchUserById(userId)
    return {
      user,
      crumb: user?.name,
    }
  },
  component: UserComponent,
})

function UserComponent() {
  const { user } = Route.useLoaderData()
  const posthog = usePostHog()

  React.useEffect(() => {
    if (user) {
      posthog.capture('team_member_viewed', {
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        role: roles[user.id % roles.length],
      })
    }
  }, [user?.id])

  if (!user) {
    return <div className="p-6">User not found</div>
  }

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2)
  const role = roles[user.id % roles.length]

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{user.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              role === 'Admin'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : role === 'Manager'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              {role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
            <h4 className="font-medium mb-3 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Contact Information
            </h4>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                <div className="font-medium">{user.phone}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Website</div>
                <div className="font-medium text-blue-600 dark:text-blue-400">{user.website}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
            <h4 className="font-medium mb-3 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Company
            </h4>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Name</div>
                <div className="font-medium">{user.company.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Business</div>
                <div className="font-medium">{user.company.bs}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Catchphrase</div>
                <div className="font-medium italic">"{user.company.catchPhrase}"</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 md:col-span-2">
            <h4 className="font-medium mb-3 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Address
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Street</div>
                <div className="font-medium">{user.address.street}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Suite</div>
                <div className="font-medium">{user.address.suite}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">City</div>
                <div className="font-medium">{user.address.city}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Zipcode</div>
                <div className="font-medium">{user.address.zipcode}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
