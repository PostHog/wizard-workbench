import { Link, useSearchParams } from "react-router";

import type { Route } from "./+types/reports";
import { resolveRange } from "../lib/reports";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Reports · Shelfwise" }];
}

function StockTurnover({ range }: { range: string }) {
  const { label, weeks } = resolveRange(range);
  return (
    <p>
      Stock turnover for {label}: {(weeks * 0.37).toFixed(1)}×
    </p>
  );
}

export default function Reports() {
  const [searchParams] = useSearchParams();
  const range = searchParams.get("range") ?? "ytd";
  return (
    <main>
      <h1>Reports</h1>
      <nav>
        {["q1", "q2", "q3", "q4", "ytd"].map((option) => (
          <Link key={option} to={`?range=${option}`} style={{ marginRight: "1rem" }}>
            {option.toUpperCase()}
          </Link>
        ))}
        <Link to="/reports/forecast?region=eu-1">Demand forecast</Link>
      </nav>
      <StockTurnover range={range} />
    </main>
  );
}
