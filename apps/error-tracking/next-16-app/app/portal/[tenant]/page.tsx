export default async function PortalPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  return (
    <>
      <h1>Customer portal</h1>
      <p>Signed in to {tenant}.</p>
    </>
  );
}
