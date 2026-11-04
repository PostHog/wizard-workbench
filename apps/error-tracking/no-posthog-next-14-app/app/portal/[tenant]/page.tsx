export default function PortalPage({ params }: { params: { tenant: string } }) {
  const { tenant } = params;
  return (
    <>
      <h1>Customer portal</h1>
      <p>Signed in to {tenant}.</p>
    </>
  );
}
