'use client';

import './globals.css';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main>
          <h1>Ledgerly hit a snag</h1>
          <p>Something went wrong on our side. Please try again.</p>
          <button onClick={() => reset()}>Reload</button>
        </main>
      </body>
    </html>
  );
}
