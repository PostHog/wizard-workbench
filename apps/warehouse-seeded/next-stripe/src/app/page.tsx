import { PRICE_IDS } from '@/lib/stripe';

export default function Page() {
  return (
    <main>
      <h1>Plans</h1>
      <ul>
        {Object.keys(PRICE_IDS).map((plan) => (
          <li key={plan}>{plan}</li>
        ))}
      </ul>
    </main>
  );
}
