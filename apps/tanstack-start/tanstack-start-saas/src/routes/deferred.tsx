import { Await, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Suspense, useState } from 'react'

const personServerFn = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(({ data: name }) => {
    return { name, randomNumber: Math.floor(Math.random() * 100) }
  })

const slowServerFn = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: name }) => {
    await new Promise((r) => setTimeout(r, 1000))
    return { name, randomNumber: Math.floor(Math.random() * 100) }
  })

export const Route = createFileRoute('/deferred')({
  loader: async () => {
    return {
      deferredStuff: new Promise<string>((r) =>
        setTimeout(() => r('Hello deferred!'), 2000),
      ),
      deferredPerson: slowServerFn({ data: 'Tanner Linsley' }),
      person: await personServerFn({ data: 'John Doe' }),
    }
  },
  component: Deferred,
})

function Deferred() {
  const [count, setCount] = useState(0)
  const { deferredStuff, deferredPerson, person } = Route.useLoaderData()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Real-time metrics with streaming data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700"
          data-testid="regular-person"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Active Users
          </p>
          <p className="text-3xl font-bold">{person.randomNumber}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {person.name}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          }
        >
          <Await
            promise={deferredPerson}
            children={(data) => (
              <div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700"
                data-testid="deferred-person"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Revenue Today
                </p>
                <p className="text-3xl font-bold">${data.randomNumber * 100}</p>
                <p className="text-sm text-green-600 mt-1">+12% from yesterday</p>
              </div>
            )}
          />
        </Suspense>

        <Suspense
          fallback={
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          }
        >
          <Await
            promise={deferredStuff}
            children={(data) => (
              <div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700"
                data-testid="deferred-stuff"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </p>
                <p className="text-3xl font-bold text-green-600">Live</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {data}
                </p>
              </div>
            )}
          />
        </Suspense>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
        <h2 className="font-semibold mb-4">Interactive Counter Demo</h2>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold">{count}</span>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  )
}
