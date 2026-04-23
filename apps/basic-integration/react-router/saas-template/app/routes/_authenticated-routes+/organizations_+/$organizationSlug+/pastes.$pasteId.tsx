import { data, href, redirect } from "react-router";

import type { Route } from "./+types/pastes.$pasteId";
import { organizationMembershipContext } from "~/features/organizations/organizations-middleware.server";
import { prisma } from "~/utils/database.server";

export async function loader({ params, context }: Route.LoaderArgs) {
  const { organizationSlug, pasteId } = params;
  
  if (!pasteId) {
    throw new Response("Paste ID required", { status: 400 });
  }

  const { organization, headers } = context.get(organizationMembershipContext);

  if (organization.slug !== organizationSlug) {
    throw redirect(
      href("/organizations/:organizationSlug/pastes/:pasteId", {
        organizationSlug: organization.slug,
        pasteId,
      }),
    );
  }

  const paste = await prisma.paste.findFirst({
    where: {
      id: pasteId,
      organizationId: organization.id,
    },
  });

  if (!paste) {
    throw new Response("Paste not found", { status: 404 });
  }

  await prisma.paste.update({
    where: { id: pasteId },
    data: { viewCount: { increment: 1 } },
  });

  return data(
    {
      paste: {
        ...paste,
        viewCount: paste.viewCount + 1,
      },
      pageTitle: paste.title,
    },
    { headers },
  );
}

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.pageTitle || "View Paste" },
];

export default function ViewPasteRoute({ loaderData }: Route.ComponentProps) {
  const { paste } = loaderData;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="w-full max-w-4xl rounded-lg border bg-card p-6">
        <h1 className="mb-4 text-2xl font-semibold">{paste.title}</h1>
        <pre className="whitespace-pre-wrap break-words font-mono text-sm">
          {paste.content}
        </pre>
      </div>
    </div>
  );
}

