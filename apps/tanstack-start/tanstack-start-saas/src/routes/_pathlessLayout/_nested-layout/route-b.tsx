import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_pathlessLayout/_nested-layout/route-b')(
  {
    component: LayoutBComponent,
  },
)

function LayoutBComponent() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
        <div>
          <p className="font-medium">Email Notifications</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Receive email updates about your account
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
        <div>
          <p className="font-medium">Push Notifications</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Receive push notifications on your device
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="font-medium">Invoice Reminders</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Get reminded about upcoming invoice due dates
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  )
}
