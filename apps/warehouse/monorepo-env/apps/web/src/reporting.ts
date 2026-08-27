/**
 * The web app talks to the reporting replica through a connection string and
 * nothing else — no driver is declared in this package. The dependency is
 * provided by the runtime, so `DATABASE_URL` is the only trace of Postgres in
 * this workspace package.
 */
export function reportingDsn(): string {
  const dsn = process.env.DATABASE_URL;
  if (!dsn) throw new Error('DATABASE_URL is not set');
  return dsn;
}

export interface DeskStats {
  openTickets: number;
  medianFirstResponseMinutes: number;
}

export async function deskStats(): Promise<DeskStats> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`stats failed: ${response.status}`);
  return response.json();
}
