import {
  CreditLimitError,
  CustomerLookupError,
  InvoiceTotalMismatchError,
  PaymentReconcileError,
  PdfLayoutError,
  ReminderQueueError,
} from './errors';

export type InvoiceLine = { description: string; amountCents: number };

export type Invoice = {
  id: string;
  customerId: string;
  issuedOn: string;
  status: 'draft' | 'sent' | 'paid';
  lines: InvoiceLine[];
  totalCents: number;
};

const CUSTOMERS: Record<string, { name: string; creditLimitCents: number }> = {
  'ACME-0007': { name: 'Acme Corp', creditLimitCents: 5_000_000 },
  'ACME-0042': { name: 'Acme Logistics', creditLimitCents: 0 },
  'GLBX-0101': { name: 'Globex', creditLimitCents: 2_000_000 },
  'INIT-0300': { name: 'Initech', creditLimitCents: 1_000_000 },
  'UMBR-0471': { name: 'Umbrella Health', creditLimitCents: 3_000_000 },
  'HOOL-0515': { name: 'Hooli', creditLimitCents: 9_000_000 },
};

const INVOICES: Invoice[] = [
  {
    id: 'INV-1001',
    customerId: 'ACME-0007',
    issuedOn: '2026-09-02',
    status: 'paid',
    lines: [{ description: 'Annual support plan', amountCents: 480_000 }],
    totalCents: 480_000,
  },
  {
    id: 'INV-2202',
    customerId: 'GLBX-0101',
    issuedOn: '2026-09-18',
    status: 'sent',
    lines: [
      { description: 'Onboarding workshop', amountCents: 150_000 },
      { description: 'Travel', amountCents: 32_500 },
    ],
    totalCents: 182_500,
  },
  {
    id: 'INV-3003',
    customerId: 'INIT-0300',
    issuedOn: '2026-10-01',
    status: 'draft',
    lines: [{ description: 'TPS report automation', amountCents: 99_000 }],
    totalCents: 99_000,
  },
  {
    id: 'INV-4471',
    customerId: 'UMBR-0471',
    issuedOn: '2026-10-04',
    status: 'sent',
    lines: [
      { description: 'Data migration', amountCents: 240_000 },
      { description: 'Discount', amountCents: -24_000 },
    ],
    totalCents: 240_000,
  },
  {
    id: 'INV-5150',
    customerId: 'HOOL-0515',
    issuedOn: '2026-10-09',
    status: 'sent',
    lines: Array.from({ length: 64 }, (_, i) => ({
      description: `Compute reservation block ${i + 1}`,
      amountCents: 12_000,
    })),
    totalCents: 64 * 12_000,
  },
  {
    id: 'INV-0913',
    customerId: 'CUST-0913',
    issuedOn: '2026-10-12',
    status: 'draft',
    lines: [{ description: 'Consulting', amountCents: 75_000 }],
    totalCents: 75_000,
  },
];

const LINES_PER_PDF_PAGE = 48;
const BILLING_DATE = '2026-10-28';

export function listInvoices(): Invoice[] {
  return INVOICES;
}

export function findInvoice(id: string): Invoice | undefined {
  return INVOICES.find((invoice) => invoice.id === id);
}

export function customerName(invoice: Invoice): string {
  const customer = CUSTOMERS[invoice.customerId];
  if (!customer) {
    throw new CustomerLookupError(`Customer record missing for ${invoice.id} (MX13)`);
  }
  return customer.name;
}

export function reconcileTotals(invoice: Invoice): number {
  const sum = invoice.lines.reduce((acc, line) => acc + line.amountCents, 0);
  if (sum !== invoice.totalCents) {
    throw new InvoiceTotalMismatchError(`Invoice total mismatch for ${invoice.id} (TM71)`);
  }
  return sum;
}

export function renderPdf(invoice: Invoice): string {
  if (invoice.lines.length > LINES_PER_PDF_PAGE) {
    throw new PdfLayoutError(`PDF layout overflow on ${invoice.id} (PD50)`);
  }
  const body = invoice.lines.map((l) => `${l.description}\t${formatMoney(l.amountCents)}`).join('\n');
  return `INVOICE ${invoice.id}\n${body}\nTOTAL ${formatMoney(invoice.totalCents)}\n`;
}

export async function queueReminder(invoice: Invoice): Promise<void> {
  // The reminder queue only accepts invoices that were sent less than 30 days ago.
  const ageDays = (Date.parse(BILLING_DATE) - Date.parse(invoice.issuedOn)) / 86_400_000;
  if (invoice.status === 'sent' && ageDays > 30) {
    throw new ReminderQueueError(`Reminder queue rejected ${invoice.id} (RQ02)`);
  }
}

export function checkCredit(customerId: string, amountCents: number): void {
  const customer = CUSTOMERS[customerId];
  if (customer && amountCents > customer.creditLimitCents) {
    throw new CreditLimitError(`Credit limit check failed for ${customerId} (CL42)`);
  }
}

export async function reconcilePayment(paymentId: string, invoiceId: string): Promise<void> {
  const invoice = findInvoice(invoiceId);
  if (!invoice || invoice.status !== 'paid') {
    throw new PaymentReconcileError(`Payment reconcile failed for ${paymentId} (RC21)`);
  }
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
