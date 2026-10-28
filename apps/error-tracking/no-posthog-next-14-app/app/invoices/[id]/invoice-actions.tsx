'use client';

import { useState } from 'react';
import { CsvExportError } from '@/lib/errors';
import type { Invoice } from '@/lib/invoices';

const COLUMN_MAPS: Record<string, string[]> = {
  'ACME-0007': ['description', 'amount'],
  'GLBX-0101': ['description', 'amount'],
  'UMBR-0471': ['description', 'amount'],
  'HOOL-0515': ['description', 'amount'],
};

function toCsv(invoice: Invoice): string {
  const columns = COLUMN_MAPS[invoice.customerId];
  if (!columns) {
    throw new CsvExportError(`CSV encoder has no column map for ${invoice.id} (CE03)`);
  }
  return [columns.join(','), ...invoice.lines.map((l) => `"${l.description}",${l.amountCents}`)].join('\n');
}

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const [status, setStatus] = useState<string | null>(null);

  async function sendReminder() {
    setStatus('Sending…');
    const res = await fetch(`/api/invoices/${invoice.id}/remind`, { method: 'POST' });
    setStatus(res.ok ? 'Reminder sent' : 'Could not send reminder');
  }

  function downloadCsv() {
    const blob = new Blob([toCsv(invoice)], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${invoice.id}.csv`;
    link.click();
  }

  return (
    <p>
      <a href={`/api/invoices/${invoice.id}/pdf`}>Download PDF</a>{' '}
      <button onClick={downloadCsv}>Download CSV</button>
      <button onClick={sendReminder}>Send reminder</button>
      {status && <span className="notice">{status}</span>}
    </p>
  );
}
