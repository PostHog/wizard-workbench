import { createContext } from "react-router";

import type { Route } from "./+types/store";
import { resolveTenant, type Tenant } from "../lib/inventory.server";

const tenantContext = createContext<Tenant>();

export const middleware: Route.MiddlewareFunction[] = [
  async ({ params, context }, next) => {
    context.set(tenantContext, resolveTenant(params.tenant));
    return next();
  },
];

export function loader({ context }: Route.LoaderArgs) {
  return { tenant: context.get(tenantContext) };
}

export default function Store({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>{loaderData.tenant.name}</h1>
      <p>Store front for region {loaderData.tenant.region}.</p>
    </main>
  );
}
