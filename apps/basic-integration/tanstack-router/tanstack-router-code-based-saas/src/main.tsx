/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ErrorComponent,
  Link,
  MatchRoute,
  Outlet,
  RouterProvider,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  lazyRouteComponent,
  notFound,
  redirect,
  retainSearchParams,
  useNavigate,
  useRouter,
  useRouterState,
  useSearch,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { z } from 'zod'
import {
  fetchInvoiceById,
  fetchInvoices,
  fetchUserById,
  fetchUsers,
  patchInvoice,
  postInvoice,
} from './mockTodos'
import { useMutation } from './useMutation'
import { PostHogProvider, usePostHog } from '@posthog/react'
import type { NotFoundRouteProps } from '@tanstack/react-router'
import type { Invoice } from './mockTodos'
import './styles.css'

//

type UsersViewSortBy = 'name' | 'id' | 'email'

type MissingUserData = {
  userId: number
}

function isMissingUserData(data: unknown): data is MissingUserData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as { userId?: unknown }).userId === 'number'
  )
}

function UsersNotFoundComponent({ data }: NotFoundRouteProps) {
  const userId = isMissingUserData(data) ? data.userId : undefined

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">❌</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">User Not Found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {typeof userId === 'number'
            ? `We couldn't find a team member with ID ${userId}.`
            : "We couldn't find the requested team member."}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select another team member from the list to continue.
        </p>
      </div>
    </div>
  )
}

const rootRoute = createRootRouteWithContext<{
  auth: Auth
}>()({
  component: RootComponent,
})

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' })
  return <Spinner show={isLoading} />
}

function RootComponent() {
  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN!}
      options={{
        api_host: '/ingest',
        ui_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
        defaults: '2026-01-30',
        capture_exceptions: true,
        debug: import.meta.env.DEV,
      }}
    >
    <>
      <div className={`min-h-screen flex flex-col`}>
        <div className={`flex items-center border-b gap-2 bg-white dark:bg-gray-800 shadow-sm`}>
          <div className={`flex items-center gap-2 p-3`}>
            <div className={`w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}>
              <span className={`text-white font-bold text-sm`}>CF</span>
            </div>
            <h1 className={`text-xl font-semibold`}>CloudFlow</h1>
          </div>
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
                  ...(auth.status === 'loggedOut' ? [['/login', 'Sign In', '🔐']] : []),
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
    </>
    </PostHogProvider>
  )
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
})

function IndexComponent() {
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
            >
              Go to Dashboard
            </Link>
            <Link
              to="/login"
              className={`px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
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
              to={invoiceRoute.to}
              params={{ invoiceId: 3 }}
              className={`px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors`}
            >
              View Invoice
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'dashboard',
  component: DashboardLayoutComponent,
})

function DashboardLayoutComponent() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>

      <div className="flex gap-1 px-6 pt-4 bg-gray-50 dark:bg-gray-800/30 border-b">
        {(
          [
            ['/dashboard', 'Overview', '📊', true],
            ['/dashboard/invoices', 'Invoices', '📄'],
            ['/dashboard/users', 'Team', '👥'],
          ] as const
        ).map(([to, label, icon, exact]) => {
          return (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              activeProps={{
                className: `border-blue-600 text-blue-600 dark:text-blue-400`,
              }}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-900 dark:hover:text-gray-200 transition-colors -mb-px"
            >
              <span>{icon}</span>
              {label}
            </Link>
          )
        })}
      </div>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/',
  loader: () => fetchInvoices(),
  component: DashboardIndexComponent,
})

function DashboardIndexComponent() {
  const invoices = dashboardIndexRoute.useLoaderData()

  const totalRevenue = invoices.length * 1250
  const pendingCount = Math.floor(invoices.length * 0.3)
  const paidCount = invoices.length - pendingCount

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-1">Welcome back!</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of your business performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Invoices</div>
          <div className="text-2xl font-bold">{invoices.length}</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+12% from last month</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Revenue</div>
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+8% from last month</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Paid</div>
          <div className="text-2xl font-bold text-green-600">{paidCount}</div>
          <div className="text-xs text-gray-500 mt-1">{Math.round((paidCount / invoices.length) * 100)}% of total</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending</div>
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          <div className="text-xs text-gray-500 mt-1">{Math.round((pendingCount / invoices.length) * 100)}% of total</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <h4 className="font-medium mb-4">Quick Actions</h4>
          <div className="space-y-2">
            <Link
              to="/dashboard/invoices"
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">📄</span>
              <div>
                <div className="font-medium">Create Invoice</div>
                <div className="text-sm text-gray-500">Bill your clients</div>
              </div>
            </Link>
            <Link
              to="/dashboard/users"
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">👥</span>
              <div>
                <div className="font-medium">Manage Team</div>
                <div className="text-sm text-gray-500">View team members</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <h4 className="font-medium mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {invoices.slice(0, 4).map((invoice, i) => (
              <div key={invoice.id} className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-green-500' : 'bg-amber-500'}`} />
                <div className="flex-1 truncate">{invoice.title}</div>
                <div className="text-gray-500">{i % 2 === 0 ? 'Paid' : 'Pending'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const invoicesLayoutRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'invoices',
  loader: () => fetchInvoices(),
  component: InvoicesLayoutComponent,
})

function InvoicesLayoutComponent() {
  const invoices = invoicesLayoutRoute.useLoaderData()

  return (
    <div className="flex-1 flex h-full">
      <div className="w-64 bg-gray-50 dark:bg-gray-800/30 border-r overflow-auto">
        <div className="p-4 border-b">
          <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            All Invoices
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {invoices.map((invoice, i) => {
            const isPaid = i % 2 === 0
            return (
              <Link
                key={invoice.id}
                to="/dashboard/invoices/$invoiceId"
                params={{ invoiceId: invoice.id }}
                preload="intent"
                className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                activeProps={{ className: `bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-600` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">INV-{String(invoice.id).padStart(4, '0')}</span>
                  <MatchRoute
                    to={invoiceRoute.to}
                    params={{ invoiceId: invoice.id }}
                    pending
                  >
                    {(match) => <Spinner show={!!match} wait="delay-50" />}
                  </MatchRoute>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                  {invoice.title}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">${(invoice.id * 125).toLocaleString()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isPaid
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {isPaid ? 'Paid' : 'Pending'}
                  </span>
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

const invoicesIndexRoute = createRoute({
  getParentRoute: () => invoicesLayoutRoute,
  path: '/',
  component: InvoicesIndexComponent,
})

function InvoicesIndexComponent() {
  const posthog = usePostHog()
  const createInvoiceMutation = useMutation({
    fn: async (vars: Parameters<typeof postInvoice>[0]) => {
      try {
        return await postInvoice(vars)
      } catch (err) {
        posthog.capture('invoice_create_failed', { title: vars.title })
        posthog.captureException(err)
        throw err
      }
    },
    onSuccess: ({ data }) => {
      posthog.capture('invoice_created', { invoice_id: data?.id, title: data?.title })
      router.invalidate()
    },
  })

  return (
    <div className="p-6">
      <div className="max-w-xl">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Create New Invoice</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fill out the details below to create a new invoice for your client.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            const formData = new FormData(event.target as HTMLFormElement)
            createInvoiceMutation.mutate({
              title: formData.get('title') as string,
              body: formData.get('body') as string,
            })
          }}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4"
        >
          <InvoiceFields invoice={{} as Invoice} />

          <div className="flex items-center gap-3 pt-2">
            <button
              className="px-6 py-2.5 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              disabled={createInvoiceMutation.status === 'pending'}
            >
              {createInvoiceMutation.status === 'pending' ? (
                <span className="flex items-center gap-2">
                  Creating <Spinner />
                </span>
              ) : (
                'Create Invoice'
              )}
            </button>

            {createInvoiceMutation.status === 'success' ? (
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                Invoice created successfully!
              </div>
            ) : createInvoiceMutation.status === 'error' ? (
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                Failed to create invoice.
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
}

const invoiceRoute = createRoute({
  getParentRoute: () => invoicesLayoutRoute,
  path: '$invoiceId',
  params: {
    parse: (params) => ({
      invoiceId: z.number().int().parse(Number(params.invoiceId)),
    }),
    stringify: ({ invoiceId }) => ({ invoiceId: `${invoiceId}` }),
  },
  validateSearch: (search) =>
    z
      .object({
        showNotes: z.boolean().optional(),
        notes: z.string().optional(),
      })
      .parse(search),
  loader: ({ params: { invoiceId } }) => fetchInvoiceById(invoiceId),
  component: InvoiceComponent,
  pendingComponent: () => <Spinner />,
})

function InvoiceComponent() {
  const search = invoiceRoute.useSearch()
  const navigate = useNavigate({ from: invoiceRoute.fullPath })
  const invoice = invoiceRoute.useLoaderData()
  const posthog = usePostHog()
  const updateInvoiceMutation = useMutation({
    fn: async (vars: Parameters<typeof patchInvoice>[0]) => {
      try {
        return await patchInvoice(vars)
      } catch (err) {
        posthog.capture('invoice_update_failed', { invoice_id: vars.id })
        posthog.captureException(err)
        throw err
      }
    },
    onSuccess: ({ data }) => {
      posthog.capture('invoice_updated', { invoice_id: data?.id, title: data?.title })
      router.invalidate()
    },
  })
  const [notes, setNotes] = React.useState(search.notes ?? '')
  React.useEffect(() => {
    navigate({
      search: (old) => ({
        ...old,
        notes: notes ? notes : undefined,
      }),
      params: true,
      replace: true,
    })
  }, [notes])

  const isPaid = invoice.id % 2 === 0
  const amount = invoice.id * 125

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">
              Invoice INV-{String(invoice.id).padStart(4, '0')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created on {new Date().toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPaid
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {isPaid ? 'Paid' : 'Pending'}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</div>
              <div className="text-2xl font-bold">${amount.toLocaleString()}.00</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Due Date</div>
              <div className="text-lg font-medium">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <form
          key={invoice.id}
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            const formData = new FormData(event.target as HTMLFormElement)
            updateInvoiceMutation.mutate({
              id: invoice.id,
              title: formData.get('title') as string,
              body: formData.get('body') as string,
            })
          }}
          className="space-y-4"
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
            <h4 className="font-medium mb-4">Invoice Details</h4>
            <InvoiceFields
              invoice={invoice}
              disabled={updateInvoiceMutation.status === 'pending'}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Internal Notes</h4>
              <Link
                search={(old) => ({
                  ...old,
                  showNotes: old.showNotes ? undefined : true,
                })}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                from={invoiceRoute.fullPath}
                params={true}
              >
                {search.showNotes ? 'Hide Notes' : 'Add Notes'}
              </Link>
            </div>
            {search.showNotes ? (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Add internal notes about this invoice..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Notes are saved in the URL for easy sharing with your team.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click "Add Notes" to attach internal notes to this invoice.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-6 py-2.5 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              disabled={updateInvoiceMutation.status === 'pending'}
            >
              Save Changes
            </button>

            {updateInvoiceMutation.variables?.id === invoice.id ? (
              <div key={updateInvoiceMutation.submittedAt}>
                {updateInvoiceMutation.status === 'success' ? (
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                    Changes saved!
                  </div>
                ) : updateInvoiceMutation.status === 'error' ? (
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                    Failed to save changes.
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
}

const usersLayoutRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'users',
  validateSearch: z.object({
    usersView: z
      .object({
        sortBy: z.enum(['name', 'id', 'email']).optional(),
        filterBy: z.string().optional(),
      })
      .optional(),
  }).parse,
  search: {
    // Retain the usersView search param while navigating
    // within or to this route (or it's children!)
    middlewares: [retainSearchParams(['usersView'])],
  },
  loaderDeps: ({ search: { usersView } }) => ({
    filterBy: usersView?.filterBy,
    sortBy: usersView?.sortBy ?? 'name',
  }),
  loader: ({ deps }) => fetchUsers(deps),
  notFoundComponent: UsersNotFoundComponent,
  component: UsersLayoutComponent,
})

const roles = ['Admin', 'Member', 'Viewer', 'Editor', 'Manager']

function UsersLayoutComponent() {
  const navigate = useNavigate({ from: usersLayoutRoute.fullPath })
  const { usersView } = usersLayoutRoute.useSearch()
  const users = usersLayoutRoute.useLoaderData()
  const sortBy = usersView?.sortBy ?? 'name'
  const filterBy = usersView?.filterBy

  const [filterDraft, setFilterDraft] = React.useState(filterBy ?? '')

  React.useEffect(() => {
    setFilterDraft(filterBy ?? '')
  }, [filterBy])

  const sortedUsers = React.useMemo(() => {
    if (!users) return []

    return !sortBy
      ? users
      : [...users].sort((a, b) => {
          return a[sortBy] > b[sortBy] ? 1 : -1
        })
  }, [users, sortBy])

  const filteredUsers = React.useMemo(() => {
    if (!filterBy) return sortedUsers

    return sortedUsers.filter((user) =>
      user.name.toLowerCase().includes(filterBy.toLowerCase()),
    )
  }, [sortedUsers, filterBy])

  const setSortBy = (sortBy: UsersViewSortBy) =>
    navigate({
      search: (old) => {
        return {
          ...old,
          usersView: {
            ...(old.usersView ?? {}),
            sortBy,
          },
        }
      },
      replace: true,
    })

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
              {filteredUsers.length}
            </span>
          </div>
          <input
            value={filterDraft}
            onChange={(e) => setFilterDraft(e.target.value)}
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
          {filteredUsers.map((user, i) => {
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
                      to={userRoute.to}
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

const usersIndexRoute = createRoute({
  getParentRoute: () => usersLayoutRoute,
  path: '/',
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

const userRoute = createRoute({
  getParentRoute: () => usersLayoutRoute,
  path: 'user',
  validateSearch: z.object({
    userId: z.number(),
  }),
  loaderDeps: ({ search: { userId } }) => ({
    userId,
  }),
  loader: async ({ deps: { userId } }) => {
    const user = await fetchUserById(userId)

    if (!user) {
      throw notFound({
        data: {
          userId,
        },
      })
    }

    return user
  },
  component: UserComponent,
})

function UserComponent() {
  const user = userRoute.useLoaderData()

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

const expensiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  // Your elements can be asynchronous, which means you can code-split!
  path: 'expensive',
  component: lazyRouteComponent(() => import('./Expensive')),
})

const authPathlessLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  // Before loading, authenticate the user via our auth context
  // This will also happen during prefetching (e.g. hovering over links, etc)
  beforeLoad: ({ context, location }) => {
    // If the user is logged out, redirect them to the login page
    if (context.auth.status === 'loggedOut') {
      console.log(location)
      throw redirect({
        to: loginRoute.to,
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      })
    }

    // Otherwise, return the user in context
    return {
      username: auth.username,
    }
  },
})

const profileRoute = createRoute({
  getParentRoute: () => authPathlessLayoutRoute,
  path: 'profile',
  component: ProfileComponent,
})

function ProfileComponent() {
  const { username } = profileRoute.useRouteContext()
  const posthog = usePostHog()

  const initials = username?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{username}</h2>
              <p className="text-gray-600 dark:text-gray-400">Free Plan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                defaultValue={username ?? ''}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue={`${username?.toLowerCase()}@example.com`}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Subscription</h3>
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-medium">Free Plan</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Basic features included</div>
            </div>
            <button
              onClick={() => posthog.capture('plan_upgrade_clicked', { current_plan: 'free' })}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upgrade
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span>Go to Dashboard</span>
              <span className="text-gray-400">→</span>
            </Link>
            <button
              onClick={() => {
                posthog.capture('user_signed_out')
                posthog.reset()
                auth.logout()
                router.invalidate()
              }}
              className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <span>Sign Out</span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
}).update({
  component: LoginComponent,
})

function LoginComponent() {
  const router = useRouter()
  const { auth, status } = loginRoute.useRouteContext({
    select: ({ auth }) => ({ auth, status: auth.status }),
  })
  const search = useSearch({ from: loginRoute.fullPath })
  const [username, setUsername] = React.useState('')
  const posthog = usePostHog()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    auth.login(username)
    posthog.identify(username, { username })
    posthog.capture('user_signed_in', { username })
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
                posthog.capture('user_signed_out')
                posthog.reset()
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

const pathlessLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'pathless-layout',
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return (
    <div>
      <div>Pathless Layout</div>
      <hr />
      <Outlet />
    </div>
  )
}

const pathlessLayoutARoute = createRoute({
  getParentRoute: () => pathlessLayoutRoute,
  path: 'route-a',
  component: PathlessLayoutAComponent,
})

function PathlessLayoutAComponent() {
  return (
    <div>
      <div>I'm A</div>
    </div>
  )
}

const pathlessLayoutBRoute = createRoute({
  getParentRoute: () => pathlessLayoutRoute,
  path: 'route-b',
  component: PathlessLayoutBComponent,
})

function PathlessLayoutBComponent() {
  return (
    <div>
      <div>I'm B</div>
    </div>
  )
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    invoicesLayoutRoute.addChildren([invoicesIndexRoute, invoiceRoute]),
    usersLayoutRoute.addChildren([usersIndexRoute, userRoute]),
  ]),
  expensiveRoute,
  authPathlessLayoutRoute.addChildren([profileRoute]),
  loginRoute,
  pathlessLayoutRoute.addChildren([pathlessLayoutARoute, pathlessLayoutBRoute]),
])

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    auth: undefined!, // We'll inject this when we render
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const auth: Auth = {
  status: 'loggedOut',
  username: undefined,
  login: (username: string) => {
    auth.username = username
    auth.status = 'loggedIn'
  },
  logout: () => {
    auth.status = 'loggedOut'
    auth.username = undefined
  },
}

function App() {
  // This stuff is just to tweak our sandbox setup in real-time
  const [loaderDelay, setLoaderDelay] = useSessionStorage('loaderDelay', 500)
  const [pendingMs, setPendingMs] = useSessionStorage('pendingMs', 1000)
  const [pendingMinMs, setPendingMinMs] = useSessionStorage('pendingMinMs', 500)

  return (
    <>
      <div className="text-xs fixed w-52 shadow-md shadow-black/20 rounded-sm bottom-2 left-2 bg-white dark:bg-gray-800 bg-opacity-75 border-b flex flex-col gap-1 flex-wrap items-left divide-y">
        <div className="p-2 space-y-2">
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white rounded-sm p-1 px-2"
              onClick={() => {
                setLoaderDelay(150)
              }}
            >
              Fast
            </button>
            <button
              className="bg-blue-500 text-white rounded-sm p-1 px-2"
              onClick={() => {
                setLoaderDelay(500)
              }}
            >
              Fast 3G
            </button>
            <button
              className="bg-blue-500 text-white rounded-sm p-1 px-2"
              onClick={() => {
                setLoaderDelay(2000)
              }}
            >
              Slow 3G
            </button>
          </div>
          <div>
            <div>Loader Delay: {loaderDelay}ms</div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={loaderDelay}
              onChange={(e) => setLoaderDelay(e.target.valueAsNumber)}
              className="w-full"
            />
          </div>
        </div>
        <div className="p-2 space-y-2">
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white rounded-sm p-1 px-2"
              onClick={() => {
                setPendingMs(1000)
                setPendingMinMs(500)
              }}
            >
              Reset to Default
            </button>
          </div>
          <div>
            <div>defaultPendingMs: {pendingMs}ms</div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={pendingMs}
              onChange={(e) => setPendingMs(e.target.valueAsNumber)}
              className="w-full"
            />
          </div>
          <div>
            <div>defaultPendingMinMs: {pendingMinMs}ms</div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={pendingMinMs}
              onChange={(e) => setPendingMinMs(e.target.valueAsNumber)}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <RouterProvider
        router={router}
        defaultPreload="intent"
        defaultPendingMs={pendingMs}
        defaultPendingMinMs={pendingMinMs}
        context={{
          auth,
        }}
      />
    </>
  )
}

function InvoiceFields({
  invoice,
  disabled,
}: {
  invoice: Invoice
  disabled?: boolean
}) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Client / Project Name
        </label>
        <input
          id="title"
          name="title"
          defaultValue={invoice.title}
          placeholder="e.g., Acme Corp - Website Redesign"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        />
      </div>
      <div>
        <label htmlFor="body" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="body"
          name="body"
          defaultValue={invoice.body}
          rows={4}
          placeholder="Describe the work completed or services provided..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          disabled={disabled}
        />
      </div>
    </div>
  )
}

type Auth = {
  login: (username: string) => void
  logout: () => void
  status: 'loggedOut' | 'loggedIn'
  username?: string
}

function Spinner({ show, wait }: { show?: boolean; wait?: `delay-${number}` }) {
  return (
    <div
      className={`inline-block animate-spin px-3 transition ${
        (show ?? true)
          ? `opacity-1 duration-500 ${wait ?? 'delay-300'}`
          : 'duration-500 opacity-0 delay-0'
      }`}
    >
      ⍥
    </div>
  )
}

function useSessionStorage<T>(key: string, initialValue: T) {
  const state = React.useState<T>(() => {
    const stored = sessionStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  React.useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state[0]))
  }, [state[0]])

  return state
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
