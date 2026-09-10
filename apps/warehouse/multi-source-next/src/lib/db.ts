import { Pool } from 'pg';

/**
 * The support desk's own Postgres. Holds tickets, agents and SLA state — the
 * tables the product reads on every request.
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

export interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  customer_email: string;
  opened_at: string;
}

export async function openTickets(limit = 50): Promise<Ticket[]> {
  const { rows } = await pool.query<Ticket>(
    `SELECT id, subject, status, customer_email, opened_at
       FROM tickets
      WHERE status <> 'closed'
      ORDER BY opened_at DESC
      LIMIT $1`,
    [limit],
  );
  return rows;
}
