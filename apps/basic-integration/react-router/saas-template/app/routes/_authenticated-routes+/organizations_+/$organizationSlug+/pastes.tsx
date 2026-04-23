import { data, Form, href, Link, redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/pastes";
import { canCreatePaste } from "~/features/pastebin/paste-helpers.server";
import { organizationMembershipContext } from "~/features/organizations/organizations-middleware.server";
import { prisma } from "~/utils/database.server";
import { validateFormData } from "~/utils/validate-form-data.server";

const createPasteSchema = z.object({
  intent: z.literal("create"),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(100000), // 100KB max
  language: z.string().optional(),
  isPublic: z.string().optional().transform((val) => val === "on"),
});

const deletePasteSchema = z.object({
  intent: z.literal("delete"),
  pasteId: z.string().min(1),
});

const pasteActionSchema = z.discriminatedUnion("intent", [
  createPasteSchema,
  deletePasteSchema,
]);

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const { organizationSlug } = params;
  
  // If there's a pasteId in the URL, this route shouldn't handle it
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const pasteIndex = pathParts.indexOf('pastes');
  if (pasteIndex !== -1 && pathParts[pasteIndex + 1] && pathParts[pasteIndex + 1] !== '') {
    // There's a pasteId, let the detail route handle it
    throw new Response("", { status: 404 });
  }
  const { user, organization, headers } = context.get(organizationMembershipContext);

  if (organization.slug !== organizationSlug) {
    throw redirect(href("/organizations/:organizationSlug/pastes", { organizationSlug: organization.slug }));
  }

  const pastes = await prisma.paste.findMany({
    where: {
      organizationId: organization.id,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100, // Limit to 100 most recent
  });

  const pasteLimits = await canCreatePaste(organization.id);

  // Format dates consistently on the server to avoid hydration mismatches
  const pastesWithFormattedDates = pastes.map((paste) => ({
    ...paste,
    formattedCreatedAt: new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }).format(new Date(paste.createdAt)),
  }));

  return data(
    {
      pastes: pastesWithFormattedDates,
      pasteLimits,
      breadcrumb: {
        title: "Pastes",
        to: href("/organizations/:organizationSlug/pastes", {
          organizationSlug: organization.slug,
        }),
      },
      pageTitle: "Pastes",
    },
    { headers },
  );
}

export async function action({ params, request, context }: Route.ActionArgs) {
  const { organizationSlug } = params;
  const { user, organization, headers } = context.get(organizationMembershipContext);

  if (organization.slug !== organizationSlug) {
    throw redirect(href("/organizations/:organizationSlug/pastes", { organizationSlug: organization.slug }));
  }

  const result = await validateFormData(request, pasteActionSchema);

  if (!result.success) {
    return result.response;
  }

  const { data: body } = result;

  switch (body.intent) {
    case "create": {

      // Check if organization can create more pastes
      const limits = await canCreatePaste(organization.id);
      if (!limits.canCreate) {
        return data(
          {
            errors: {
              _form: [
                `You've reached your paste limit (${limits.currentCount}/${limits.limit}). Upgrade your plan to create more pastes!`,
              ],
            },
          },
          { status: 403 },
        );
      }

      const paste = await prisma.paste.create({
        data: {
          title: body.title,
          content: body.content,
          language: body.language || null,
          isPublic: body.isPublic || false,
          organizationId: organization.id,
          createdById: user.id,
        },
      });

      return redirect(
        href("/organizations/:organizationSlug/pastes/:pasteId", {
          organizationSlug: organization.slug,
          pasteId: paste.id,
        }),
        { headers },
      );
    }

    case "delete": {

      // Verify paste belongs to organization
      const paste = await prisma.paste.findFirst({
        where: {
          id: body.pasteId,
          organizationId: organization.id,
        },
      });

      if (!paste) {
        return data({ errors: { _form: ["Paste not found"] } }, { status: 404 });
      }

      await prisma.paste.delete({
        where: { id: body.pasteId },
      });

      return redirect(
        href("/organizations/:organizationSlug/pastes", {
          organizationSlug: organization.slug,
        }),
        { headers },
      );
    }
  }
}

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.pageTitle || "Pastes" },
];

export default function PastesRoute({ loaderData, params }: Route.ComponentProps) {
  const { pastes, pasteLimits } = loaderData;

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">📋 Your Pastes</h1>
          <p className="text-muted-foreground text-sm">
            {pasteLimits.currentCount} / {pasteLimits.limit === Infinity ? "∞" : pasteLimits.limit} pastes used
          </p>
        </div>
        {pasteLimits.canCreate ? (
          <a
            href="#create-paste"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
          >
            + New Paste
          </a>
        ) : (
          <Link
            to={href("/organizations/:organizationSlug/settings/billing", {
              organizationSlug: params.organizationSlug,
            })}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
          >
            Upgrade to Create More
          </Link>
        )}
      </div>

      {pasteLimits.currentCount === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-12">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">No pastes yet!</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Create your first paste to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pastes.map((paste) => (
            <Link
              key={paste.id}
              to={`/paste/${paste.id}`}
              className="hover:border-primary group rounded-lg border bg-card p-4 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:underline">{paste.title}</h3>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {paste.content.substring(0, 100)}
                    {paste.content.length > 100 ? "..." : ""}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{paste.formattedCreatedAt}</span>
                <span>{paste.viewCount} views</span>
                {paste.isPublic && <span className="text-primary">Public</span>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Paste Form */}
      <div id="create-paste" className="mt-8 rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Create New Paste</h2>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="create" />
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxLength={200}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="My Awesome Paste"
            />
          </div>
          <div>
            <label htmlFor="content" className="mb-2 block text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Paste your content here..."
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                className="h-4 w-4"
              />
              <label htmlFor="isPublic" className="text-sm">
                Make public
              </label>
            </div>
            <button
              type="submit"
              disabled={!pasteLimits.canCreate}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
            >
              Create Paste
            </button>
          </div>
          {!pasteLimits.canCreate && (
            <p className="text-destructive text-sm">
              You've reached your paste limit.{" "}
              <Link
                to={href("/organizations/:organizationSlug/settings/billing", {
                  organizationSlug: params.organizationSlug,
                })}
                className="underline"
              >
                Upgrade your plan
              </Link>{" "}
              to create more pastes!
            </p>
          )}
        </Form>
      </div>
    </div>
  );
}

