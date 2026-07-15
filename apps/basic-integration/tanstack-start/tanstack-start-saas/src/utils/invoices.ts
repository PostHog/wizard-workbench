import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { getPostHogClient } from './posthog-server'

export type Invoice = {
  id: number
  title: string
  description: string
  amount: number
  status: 'pending' | 'paid'
  dueDate: string
  createdAt: string
}

// In-memory store for demo purposes
const invoices: Map<number, Invoice> = new Map()
let nextId = 1
let isSeeded = false

// Seed with some initial data
function ensureSeeded() {
  if (isSeeded) return
  isSeeded = true

  const titles = [
    'Website Redesign',
    'Mobile App Development',
    'Cloud Infrastructure Setup',
    'Security Audit',
    'API Integration',
    'Database Migration',
    'UI/UX Consultation',
    'Performance Optimization',
    'DevOps Setup',
    'Technical Documentation',
  ]

  // Use deterministic values instead of random for consistent SSR
  const amounts = [2500, 8500, 4200, 1800, 3500, 6000, 2200, 4800, 7500, 1500]
  const dueDays = [15, 30, 7, 45, 21, 10, 60, 14, 28, 3]

  titles.forEach((title, index) => {
    const id = nextId++
    const dueDate = new Date(Date.now() + dueDays[index] * 86400000)
    const createdDate = new Date(Date.now() - (30 - index) * 86400000)

    invoices.set(id, {
      id,
      title,
      description: `Professional services for ${title.toLowerCase()}. Includes planning, implementation, and support.`,
      amount: amounts[index],
      status: index % 3 === 0 ? 'paid' : 'pending',
      dueDate: dueDate.toISOString(),
      createdAt: createdDate.toISOString(),
    })
  })
}

export function getAllInvoices(): Invoice[] {
  ensureSeeded()
  return Array.from(invoices.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getInvoiceById(id: number): Invoice | undefined {
  ensureSeeded()
  return invoices.get(id)
}

export function createInvoice(data: {
  title: string
  description: string
  amount: number
  dueDate: string
}): Invoice {
  const id = nextId++
  const invoice: Invoice = {
    id,
    title: data.title,
    description: data.description,
    amount: data.amount,
    status: 'pending',
    dueDate: data.dueDate,
    createdAt: new Date().toISOString(),
  }
  invoices.set(id, invoice)
  return invoice
}

export function updateInvoice(
  id: number,
  updates: Partial<Pick<Invoice, 'title' | 'description' | 'amount' | 'status' | 'dueDate'>>
): Invoice | undefined {
  const invoice = invoices.get(id)
  if (!invoice) return undefined

  const updated = { ...invoice, ...updates }
  invoices.set(id, updated)
  return updated
}

export function deleteInvoice(id: number): boolean {
  return invoices.delete(id)
}

// Server functions for route loaders
export const fetchInvoices = createServerFn().handler(async () => {
  console.info('Fetching all invoices...')
  return getAllInvoices()
})

export const fetchInvoice = createServerFn({ method: 'POST' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: invoiceId }) => {
    console.info(`Fetching invoice with id ${invoiceId}...`)
    const id = Number(invoiceId)
    if (isNaN(id)) {
      throw new Error('Invalid invoice ID')
    }
    const invoice = getInvoiceById(id)
    if (!invoice) {
      throw notFound()
    }
    return invoice
  })

export const createInvoiceFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: {
      title: string
      description: string
      amount: number
      dueDate: string
      distinctId: string
      sessionId?: string
    }) => d
  )
  .handler(async ({ data }) => {
    console.info('Creating invoice...', data)
    const invoice = createInvoice(data)
    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: data.distinctId,
      event: 'invoice_created',
      properties: {
        $session_id: data.sessionId,
        invoice_id: invoice.id,
        amount: invoice.amount,
        source: 'server',
      },
    })
    await posthog.flush()
    return invoice
  })

export const markInvoicePaid = createServerFn({ method: 'POST' })
  .inputValidator((d: { invoiceId: string; distinctId: string; sessionId?: string }) => d)
  .handler(async ({ data }) => {
    console.info(`Marking invoice ${data.invoiceId} as paid...`)
    const id = Number(data.invoiceId)
    if (isNaN(id)) {
      throw new Error('Invalid invoice ID')
    }
    const invoice = updateInvoice(id, { status: 'paid' })
    if (!invoice) {
      throw new Error('Invoice not found')
    }
    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: data.distinctId,
      event: 'invoice_paid',
      properties: {
        $session_id: data.sessionId,
        invoice_id: invoice.id,
        amount: invoice.amount,
        source: 'server',
      },
    })
    await posthog.flush()
    return invoice
  })
