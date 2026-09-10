import { NextResponse } from 'next/server';

import { planFor } from '@/lib/billing';
import { ownerForDomain } from '@/lib/crm';
import { pool } from '@/lib/db';
import { triage } from '@/lib/triage';

/**
 * Inbound ticket. One request touches four systems: classify the text, look up
 * the account owner, look up the plan for SLA, then store the row.
 */
export async function POST(request: Request) {
  const { subject, body, email, stripeCustomerId } = await request.json();

  const [{ label }, owner, plan] = await Promise.all([
    triage(subject, body),
    ownerForDomain(email.split('@')[1]),
    stripeCustomerId ? planFor(stripeCustomerId) : Promise.resolve(null),
  ]);

  const { rows } = await pool.query(
    `INSERT INTO tickets (subject, body, customer_email, queue, owner_id, plan, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'open')
     RETURNING id`,
    [subject, body, email, label, owner?.hubspot_owner_id ?? null, plan],
  );

  return NextResponse.json({ id: rows[0].id, queue: label, plan });
}
