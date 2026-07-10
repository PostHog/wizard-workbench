import { createFileRoute, Link } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const posthog = usePostHog()

  return (
    <div className={`p-8`}>
      <div className={`max-w-4xl mx-auto`}>
        <div className={`mb-8`}>
          <h1 className={`text-4xl font-bold mb-4`}>
            Welcome to CloudFlow
          </h1>
          <p className={`text-lg text-gray-600 dark:text-gray-400 mb-6`}>
            Streamline your business operations with powerful invoicing, team management, and real-time analytics.
          </p>
          <div className={`flex gap-4`}>
            <Link
              to="/dashboard"
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors`}
              onClick={() => {
                posthog.capture('marketing_cta_clicked', {
                  cta_target: 'dashboard',
                  cta_location: 'hero',
                })
              }}
            >
              Go to Dashboard
            </Link>
            <Link
              to="/login"
              className={`px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
              onClick={() => {
                posthog.capture('marketing_cta_clicked', {
                  cta_target: 'login',
                  cta_location: 'hero',
                })
              }}
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-12`}>
          <div className={`p-6 bg-gray-50 dark:bg-gray-800 rounded-xl`}>
            <div className={`w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4`}>
              <span className={`text-2xl`}>📊</span>
            </div>
            <h3 className={`text-lg font-semibold mb-2`}>Dashboard Analytics</h3>
            <p className={`text-gray-600 dark:text-gray-400`}>
              Get real-time insights into your business performance with intuitive charts and metrics.
            </p>
          </div>

          <div className={`p-6 bg-gray-50 dark:bg-gray-800 rounded-xl`}>
            <div className={`w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4`}>
              <span className={`text-2xl`}>📄</span>
            </div>
            <h3 className={`text-lg font-semibold mb-2`}>Invoice Management</h3>
            <p className={`text-gray-600 dark:text-gray-400`}>
              Create, track, and manage invoices effortlessly. Never miss a payment again.
            </p>
          </div>

          <div className={`p-6 bg-gray-50 dark:bg-gray-800 rounded-xl`}>
            <div className={`w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4`}>
              <span className={`text-2xl`}>👥</span>
            </div>
            <h3 className={`text-lg font-semibold mb-2`}>Team Collaboration</h3>
            <p className={`text-gray-600 dark:text-gray-400`}>
              Manage your team members, assign roles, and collaborate seamlessly.
            </p>
          </div>
        </div>

        <div className={`mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800`}>
          <div className={`flex items-center gap-4`}>
            <div className={`flex-1`}>
              <h3 className={`font-semibold mb-1`}>You have pending items</h3>
              <p className={`text-sm text-gray-600 dark:text-gray-400`}>
                Check your dashboard for new invoices that need your attention.
              </p>
            </div>
            <Link
              to="/dashboard/invoices/$invoiceId"
              params={{ invoiceId: 3 }}
              className={`px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors`}
              onClick={() => {
                posthog.capture('marketing_cta_clicked', {
                  cta_target: 'invoice_preview',
                  cta_location: 'pending_items',
                })
              }}
            >
              View Invoice
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
