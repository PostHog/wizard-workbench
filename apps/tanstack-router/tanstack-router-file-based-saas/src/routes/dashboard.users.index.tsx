import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/users/')({
  component: UsersIndexComponent,
})

function UsersIndexComponent() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">👥</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Select a Team Member</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a team member from the list to view their profile, contact information, and role details.
        </p>
      </div>
    </div>
  )
}
