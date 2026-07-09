import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'
import { fetchUsers } from '../utils/users'

export const Route = createFileRoute('/users')({
  loader: () => fetchUsers(),
  component: UsersComponent,
})

function UsersComponent() {
  const users = Route.useLoaderData()
  const posthog = usePostHog()
  const roles = ['Admin', 'Developer', 'Designer', 'Manager', 'Analyst']

  return (
    <div className="flex h-full">
      <div className="w-72 border-r dark:border-gray-700 overflow-auto">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="font-semibold text-lg">Team Members</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {users.length} members
          </p>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {[
            ...users,
            { id: 'i-do-not-exist', name: 'Non-existent User', email: 'ghost@example.com' },
          ].map((user, index) => {
            const initials = user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
            const colors = [
              'bg-blue-500',
              'bg-green-500',
              'bg-purple-500',
              'bg-orange-500',
              'bg-pink-500',
            ]
            const bgColor = colors[index % colors.length]

            return (
              <Link
                key={user.id}
                to="/users/$userId"
                params={{
                  userId: String(user.id),
                }}
                onClick={() => {
                  posthog.capture('team_member_selected', {
                    team_member_id: String(user.id),
                    role: roles[index % roles.length],
                    source: 'team_list',
                  })
                }}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                activeProps={{
                  className:
                    'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-600',
                }}
              >
                <div
                  className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center text-white font-medium`}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {roles[index % roles.length]}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
