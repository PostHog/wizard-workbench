import { createFileRoute } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'
import { useEffect } from 'react'
import { NotFound } from '~/components/NotFound'
import { UserErrorComponent } from '~/components/UserError'
import { fetchUser } from '../utils/users'

export const Route = createFileRoute('/users/$userId')({
  loader: ({ params: { userId } }) => fetchUser({ data: userId }),
  errorComponent: UserErrorComponent,
  component: UserComponent,
  notFoundComponent: () => {
    return <NotFound>Team member not found</NotFound>
  },
})

function UserComponent() {
  const user = Route.useLoaderData()
  const posthog = usePostHog()
  const roles = ['Admin', 'Developer', 'Designer', 'Manager', 'Analyst']
  const roleIndex = typeof user.id === 'number' ? user.id % roles.length : 0
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  useEffect(() => {
    posthog.capture('team_member_viewed', {
      team_member_id: user.id,
      role: roles[roleIndex],
      department: 'Engineering',
    })
  }, [posthog, roleIndex, user.id])

  return (
    <div className="p-6">
      <div className="flex items-start gap-6 mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {initials}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{roles[roleIndex]}</p>
          <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Active
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Department</p>
          <p className="font-medium">Engineering</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
          <p className="font-medium">San Francisco, CA</p>
        </div>
      </div>
    </div>
  )
}
