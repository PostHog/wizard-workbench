"use client";

import { useState } from "react";

type Row = { month: string; revenueCents: number };

const rows: Row[] = [
  { month: "2025-06", revenueCents: 1_204_500 },
  { month: "2025-07", revenueCents: 1_389_000 },
  { month: "2025-08", revenueCents: 1_055_050 },
];

function toCsv(data: Row[]): string {
  const header = "month,revenue";
  const lines = data.map((row) => {
    if (row.revenueCents > 1_300_000) {
      throw new Error(`CSV export failed: revenue for ${row.month} exceeds export precision`);
    }
    return `${row.month},${(row.revenueCents / 100).toFixed(2)}`;
  });
  return [header, ...lines].join("\n");
}

export default function ReportsPage() {
  const [csv, setCsv] = useState<string | null>(null);

  return (
    <>
      <h1>Reports</h1>
      <p>Monthly revenue for the last quarter.</p>
      <button type="button" onClick={() => setCsv(toCsv(rows))}>
        Export CSV
      </button>
      {csv && <pre>{csv}</pre>}
    </>
  );
}
