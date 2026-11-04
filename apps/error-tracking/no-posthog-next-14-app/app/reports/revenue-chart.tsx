'use client';

import { useEffect, useState } from 'react';
import { ReportRangeError } from '@/lib/errors';
import { formatMoney, listInvoices } from '@/lib/invoices';

const RANGES: Record<string, [string, string]> = {
  q3: ['2026-07-01', '2026-09-30'],
  q4: ['2026-10-01', '2026-12-31'],
  ytd: ['2026-01-01', '2026-12-31'],
};

function revenueFor(range: string): number {
  const bounds = RANGES[range];
  if (!bounds) {
    throw new ReportRangeError(`Unsupported report range "${range}" (RX20)`);
  }
  return listInvoices()
    .filter((i) => i.issuedOn >= bounds[0] && i.issuedOn <= bounds[1])
    .reduce((acc, i) => acc + i.totalCents, 0);
}

export function RevenueChart() {
  const [range, setRange] = useState<string | null>(null);

  useEffect(() => {
    setRange(new URLSearchParams(window.location.search).get('range') ?? 'q4');
  }, []);

  if (!range) return <p>Loading…</p>;
  return (
    <p>
      Revenue for {range}: <strong>{formatMoney(revenueFor(range))}</strong>
    </p>
  );
}
