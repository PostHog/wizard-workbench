import type { Route } from "./+types/store";
import { assertTenantActive, resolveTenant } from "../lib/inventory.server";

export function loader({ params }: Route.LoaderArgs) {
  return { tenant: assertTenantActive(resolveTenant(params.tenant)) };
}

export default function Store({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>{loaderData.tenant.name}</h1>
      <p>Store front for region {loaderData.tenant.region}.</p>
    </main>
  );
}
