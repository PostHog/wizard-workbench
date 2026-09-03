import { data, href, Link } from "react-router";

import type { Route } from "./+types/dashboard";
import { getInstance } from "~/features/localization/i18next-middleware.server";
import { getPageTitle } from "~/utils/get-page-title.server";
import { organizationMembershipContext } from "~/features/organizations/organizations-middleware.server";
import { prisma } from "~/utils/database.server";
import { canCreatePaste } from "~/features/pastebin/paste-helpers.server";

export async function loader({ params, context }: Route.LoaderArgs) {
  const i18n = getInstance(context);
  const t = i18n.t.bind(i18n);
  const { organization, headers } = context.get(organizationMembershipContext);

  const pasteCount = await prisma.paste.count({
    where: { organizationId: organization.id },
  });

  const pasteLimits = await canCreatePaste(organization.id);

  return data(
    {
      pasteCount,
      pasteLimits,
      breadcrumb: {
        title: t("organizations:dashboard.breadcrumb"),
        to: href("/organizations/:organizationSlug/dashboard", {
          organizationSlug: params.organizationSlug,
        }),
      },
      pageTitle: getPageTitle(t, "organizations:dashboard.pageTitle"),
    },
    { headers },
  );
}

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.pageTitle },
];

export default function OrganizationDashboardRoute({ loaderData, params }: Route.ComponentProps) {
  const { pasteCount, pasteLimits } = loaderData;

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Pastes</p>
              <p className="text-3xl font-bold">{pasteCount}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Paste Limit</p>
              <p className="text-3xl font-bold">
                {pasteLimits.limit === Infinity ? "∞" : pasteLimits.limit}
              </p>
            </div>
            <div className="text-4xl">🚀</div>
          </div>
        </div>
        <Link
          to={href("/organizations/:organizationSlug/pastes", {
            organizationSlug: params.organizationSlug,
          })}
          className="hover:border-primary rounded-xl border bg-card p-6 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Quick Action</p>
              <p className="font-semibold">Create New Paste</p>
            </div>
            <div className="text-4xl">✨</div>
          </div>
        </Link>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Welcome to Your Pastebin SaaS! 🎉</h2>
        <p className="text-muted-foreground mb-4">
          You've created <strong>{pasteCount}</strong> pastes so far. 
          {pasteLimits.canCreate ? (
            <> You can create {pasteLimits.limit === Infinity ? "unlimited" : `${pasteLimits.limit - pasteCount} more`} pastes with your current plan.</>
          ) : (
            <> You've reached your limit! <Link to={href("/organizations/:organizationSlug/settings/billing", { organizationSlug: params.organizationSlug })} className="text-primary underline">Upgrade your plan</Link> to create more.</>
          )}
        </p>
        <Link
          to={href("/organizations/:organizationSlug/pastes", {
            organizationSlug: params.organizationSlug,
          })}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
        >
          Manage Pastes →
        </Link>
      </div>
    </div>
  );
}
