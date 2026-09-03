import { data } from "react-router";

import type { Route } from "./+types/paste.$pasteId";
import { retrieveUserAccountWithMembershipsFromDatabaseBySupabaseUserId } from "~/features/user-accounts/user-accounts-model.server";
import { createSupabaseServerClient } from "~/features/user-authentication/supabase.server";
import { prisma } from "~/utils/database.server";

export async function loader({ params, context, request }: Route.LoaderArgs) {
  const { pasteId } = params;
  
  if (!pasteId) {
    throw new Response("Paste ID required", { status: 400 });
  }

  // First, get the paste
  const paste = await prisma.paste.findFirst({
    where: { id: pasteId },
  });

  if (!paste) {
    throw new Response("Paste not found", { status: 404 });
  }

  // If paste is public, allow access
  if (paste.isPublic) {
    await prisma.paste.update({
      where: { id: pasteId },
      data: { viewCount: { increment: 1 } },
    });

    return data({
      paste: {
        ...paste,
        viewCount: paste.viewCount + 1,
      },
      pageTitle: paste.title,
    });
  }

  // Paste is private - check if user is authenticated and has access
  const { supabase, headers } = createSupabaseServerClient({ request });
  const {
    data: { user: supabaseUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !supabaseUser) {
    // Not authenticated
    throw new Response("Paste not found", { status: 404 });
  }

  const userAccount = await retrieveUserAccountWithMembershipsFromDatabaseBySupabaseUserId(supabaseUser.id);

  if (!userAccount) {
    throw new Response("Paste not found", { status: 404 });
  }

  // Check if user is a member of the paste's organization
  const hasAccess = userAccount.memberships.some(
    (membership) => membership.organization.id === paste.organizationId
  );

  if (!hasAccess) {
    throw new Response("Paste not found", { status: 404 });
  }

  // User has access
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

