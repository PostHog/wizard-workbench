import { createClient } from '@supabase/supabase-js';

/**
 * Supabase holds the customer-facing side: auth users and the attachments
 * bucket. It is a separate project from the Postgres in `db.ts`, which is why
 * both connections exist.
 */
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

export async function attachmentsFor(ticketId: number) {
  const { data, error } = await supabase
    .from('ticket_attachments')
    .select('id, file_name, byte_size, uploaded_at')
    .eq('ticket_id', ticketId);

  if (error) throw error;
  return data;
}
