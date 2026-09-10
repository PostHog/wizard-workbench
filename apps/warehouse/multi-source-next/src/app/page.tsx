import { openTickets } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function QueuePage() {
  const tickets = await openTickets();

  return (
    <main>
      <h1>Open tickets ({tickets.length})</h1>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <strong>{ticket.subject}</strong> — {ticket.status} —{' '}
            {ticket.customer_email}
          </li>
        ))}
      </ul>
    </main>
  );
}
