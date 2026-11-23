export class CsvExportError extends Error {
  name = "CsvExportError";
}

export type CsvRow = Record<string, string | number>;

export function toCsv(header: string[], rows: CsvRow[]): string {
  const lines = rows.map((row) => {
    const keys = Object.keys(row);
    if (keys.length !== header.length) {
      throw new CsvExportError("CSV export columns do not match the header row (CE03)");
    }
    return header.map((column) => String(row[column] ?? "")).join(",");
  });
  return [header.join(","), ...lines].join("\n");
}
