import { createFileRoute, Link, MatchRoute, Outlet, retainSearchParams, useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { z } from 'zod'
import { usePostHog } from '@posthog/react'
import { Spinner } from '../components/Spinner'
import { fetchUsers } from '../utils/mockTodos'

type UsersViewSortBy = 'name' | 'id' | 'email'

export const Route = createFileRoute('/dashboard/users')({
  validateSearch: z.object({
    usersView: z
      .object({
        sortBy: z.enum(['name', 'id', 'email']).optional(),
        filterBy: z.string().optional(),
      })
      .optional(),
  }).parse,
  search: {
    middlewares: [retainSearchParams(['usersView'])],
  },
  loaderDeps: ({ search }) => ({
    filterBy: search.usersView?.filterBy,
    sortBy: search.usersView?.sortBy,
  }),
  loader: async ({ deps }) => {
    const users = await fetchUsers(deps)
    return { users, crumb: 'Team' }
  },
  component: UsersComponent,
})

const roles = ['Admin', 'Member', 'Viewer', 'Editor', 'Manager']

function UsersComponent() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { usersView } = Route.useSearch()
  const { users } = Route.useLoaderData()
  const sortBy = usersView?.sortBy ?? 'name'
  const filterBy = usersView?.filterBy
  const posthog = usePostHog()

  const [filterDraft, setFilterDraft] = React.useState(filterBy ?? '')

  React.useEffect(() => {
    setFilterDraft(filterBy ?? '')
  }, [filterBy])

  const setSortBy = (newSortBy: UsersViewSortBy) => {
    posthog.capture('team_members_sorted', { sort_by: newSortBy })
    navigate({
      search: (old) => {
        return {
          ...old,
          usersView: {
            ...(old.usersView ?? {}),
            sortBy: newSortBy,
          },
        }
      },
      replace: true,
    })
  }

  React.useEffect(() => {
    navigate({
      search: (old) => {
        return {
          ...old,
          usersView: {
            ...old.usersView,
            filterBy: filterDraft || undefined,
          },
        }
      },
      replace: true,
    })
  }, [filterDraft])

  return (
    <div className="flex-1 flex h-full">
      <div className="w-72 bg-gray-50 dark:bg-gray-800/30 border-r overflow-auto">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Team Members
            </h3>
            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {users.length}
            </span>
          </div>
          <input
            value={filterDraft}
            onChange={(e) => {
              setFilterDraft(e.target.value)
              if (e.target.value) {
                posthog.capture('team_members_filtered', { filter_query: e.target.value })
              }
            }}
            placeholder="Search team members..."
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as UsersViewSortBy)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="id">Sort by ID</option>
          </select>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user, i) => {
            const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2)
            const role = roles[i % roles.length]
            return (
              <Link
                key={user.id}
                to="/dashboard/users/user"
                search={{ userId: user.id }}
                className="flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                activeProps={{ className: `bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-600` }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{user.name}</span>
                    <MatchRoute
                      to="/dashboard/users/user"
                      search={{ userId: user.id }}
                      pending
                    >
                      {(match) => <Spinner show={!!match} wait="delay-50" />}
                    </MatchRoute>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{role}</div>
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
