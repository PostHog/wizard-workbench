import { useRouter } from 'next/router';

export default function PortalPage() {
  const { query } = useRouter();
  return (
    <>
      <h1>Customer portal</h1>
      <p>Signed in to {query.tenant}.</p>
    </>
  );
}
