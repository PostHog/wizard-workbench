import { deskStats } from '../reporting';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await deskStats();

  return (
    <main>
      <h1>Desk</h1>
      <p>{stats.openTickets} open tickets</p>
      <p>Median first response: {stats.medianFirstResponseMinutes} min</p>
    </main>
  );
}
