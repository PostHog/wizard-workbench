/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { Invoice } from '../utils/mockTodos'

export function InvoiceFields({
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
          defaultValue={invoice?.title}
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
          defaultValue={invoice?.body}
          rows={4}
          placeholder="Describe the work completed or services provided..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
