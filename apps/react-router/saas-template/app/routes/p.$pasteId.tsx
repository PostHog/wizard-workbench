import { data } from "react-router";

import type { Route } from "./+types/p.$pasteId";
import { prisma } from "~/utils/database.server";

export async function loader({ params }: Route.LoaderArgs) {
  const { pasteId } = params;

  const paste = await prisma.paste.findFirst({
    where: {
      id: pasteId,
      isPublic: true, // Only public pastes
    },
  });

  if (!paste) {
    throw new Response("Paste not found", { status: 404 });
  }

  // Increment view count
  await prisma.paste.update({
    where: { id: pasteId },
    data: { viewCount: { increment: 1 } },
  });

  return data({
    paste: {
      ...paste,
      viewCount: paste.viewCount + 1, // Show updated count immediately
    },
    pageTitle: paste.title,
  });
}

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.pageTitle || "View Paste" },
];

export default function PublicPasteRoute({ loaderData }: Route.ComponentProps) {
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

