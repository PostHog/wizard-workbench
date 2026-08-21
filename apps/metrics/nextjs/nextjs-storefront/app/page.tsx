'use client';

import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('');

  const checkout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: 'widget', qty: 1 }),
    });
    const body = await res.json();
    setStatus(`order ${body.id}: ${body.status}`);
  };

  return (
    <main>
      <h1>Storefront</h1>
      <button onClick={checkout}>Buy a widget</button>
      <p>{status}</p>
    </main>
  );
}
