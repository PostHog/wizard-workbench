'use client';

export default function ReportsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="notice">
      <p>We couldn&apos;t load this report.</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
