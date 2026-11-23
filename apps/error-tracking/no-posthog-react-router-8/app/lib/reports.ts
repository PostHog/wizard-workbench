export class ReportRangeError extends Error {
  name = "ReportRangeError";
}

const ranges: Record<string, { label: string; weeks: number }> = {
  q1: { label: "Q1", weeks: 13 },
  q2: { label: "Q2", weeks: 13 },
  q3: { label: "Q3", weeks: 13 },
  q4: { label: "Q4", weeks: 13 },
  ytd: { label: "Year to date", weeks: 47 },
};

export function resolveRange(range: string): { label: string; weeks: number } {
  const resolved = ranges[range];
  if (!resolved) {
    throw new ReportRangeError(`Report range "${range}" is not supported (RX20)`);
  }
  return resolved;
}
