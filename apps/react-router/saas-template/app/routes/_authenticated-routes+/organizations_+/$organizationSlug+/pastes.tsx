import { data, Form, href, Link, redirect } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/pastes";
import { organizationMembershipContext } from "~/features/organizations/organizations-middleware.server";
import { canCreatePaste } from "~/features/pastebin/paste-helpers.server";
import { posthogContext } from "~/lib/posthog-middleware.server";
import { prisma } from "~/utils/database.server";
import { validateFormData } from "~/utils/validate-form-data.server";

const createPasteSchema = z.object({
  content: z.string().min(1).max(100_000), // 100KB max
  intent: z.literal("create"),
  isPublic: z
    .string()
    .optional()
    .transform((val) => val === "on"),
  language: z.string().optional(),
  title: z.string().min(1).max(200),
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
  const pathParts = url.pathname.split("/");
  const pasteIndex = pathParts.indexOf("pastes");
  if (
    pasteIndex !== -1 &&
    pathParts[pasteIndex + 1] &&
    pathParts[pasteIndex + 1] !== ""
  ) {
    // There's a pasteId, let the detail route handle it
    throw new Response("", { status: 404 });
  }
  const { organization, headers } = context.get(organizationMembershipContext);

  if (organization.slug !== organizationSlug) {
    throw redirect(
      href("/organizations/:organizationSlug/pastes", {
        organizationSlug: organization.slug,
      }),
    );
  }

  const pastes = await prisma.paste.findMany({
    include: {
      createdBy: {
        select: {
          email: true,
          id: true,
          imageUrl: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100, // Limit to 100 most recent
    where: {
      organizationId: organization.id,
    },
  });

  const pasteLimits = await canCreatePaste(organization.id);

  // Format dates consistently on the server to avoid hydration mismatches
  const pastesWithFormattedDates = pastes.map((paste) => ({
    ...paste,
    formattedCreatedAt: new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(new Date(paste.createdAt)),
  }));

  return data(
    {
      breadcrumb: {
        title: "Pastes",
        to: href("/organizations/:organizationSlug/pastes", {
          organizationSlug: organization.slug,
        }),
      },
      pageTitle: "Pastes",
      pasteLimits,
      pastes: pastesWithFormattedDates,
    },
    { headers },
  );
}

export async function action({ params, request, context }: Route.ActionArgs) {
  const { organizationSlug } = params;
  const { user, organization, headers } = context.get(
    organizationMembershipContext,
  );
  const posthog = context.get(posthogContext);

  if (organization.slug !== organizationSlug) {
    throw redirect(
      href("/organizations/:organizationSlug/pastes", {
        organizationSlug: organization.slug,
      }),
    );
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
          content: body.content,
          createdById: user.id,
          isPublic: body.isPublic || false,
          language: body.language || null,
          organizationId: organization.id,
          title: body.title,
        },
      });

      posthog?.capture({
        distinctId: user.id,
        event: "paste created",
        properties: {
          is_public: paste.isPublic,
          language: paste.language,
          organization_id: organization.id,
          paste_id: paste.id,
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
        return data(
          { errors: { _form: ["Paste not found"] } },
          { status: 404 },
        );
      }

      await prisma.paste.delete({
        where: { id: body.pasteId },
      });

      posthog?.capture({
        distinctId: user.id,
        event: "paste deleted",
        properties: {
          organization_id: organization.id,
          paste_id: body.pasteId,
        },
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

export default function PastesRoute({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { pastes, pasteLimits } = loaderData;

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">📋 Your Pastes</h1>
          <p className="text-muted-foreground text-sm">
            {pasteLimits.currentCount} /{" "}
            {pasteLimits.limit === Number.POSITIVE_INFINITY
              ? "∞"
              : pasteLimits.limit}{" "}
            pastes used
          </p>
        </div>
        {pasteLimits.canCreate ? (
          <a
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
            href="#create-paste"
          >
            + New Paste
          </a>
        ) : (
          <Link
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
            to={href("/organizations/:organizationSlug/settings/billing", {
              organizationSlug: params.organizationSlug,
            })}
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
              className="hover:border-primary group rounded-lg border bg-card p-4 transition-colors"
              key={paste.id}
              to={`/paste/${paste.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:underline">
                    {paste.title}
                  </h3>
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
      <div className="mt-8 rounded-lg border bg-card p-6" id="create-paste">
        <h2 className="mb-4 text-xl font-semibold">Create New Paste</h2>
        <Form className="space-y-4" method="post">
          <input name="intent" type="hidden" value="create" />
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="title">
              Title
            </label>
            <input
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              id="title"
              maxLength={200}
              name="title"
              placeholder="My Awesome Paste"
              required
              type="text"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="content">
              Content
            </label>
            <textarea
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              id="content"
              name="content"
              placeholder="Paste your content here..."
              required
              rows={10}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                className="h-4 w-4"
                id="isPublic"
                name="isPublic"
                type="checkbox"
              />
              <label className="text-sm" htmlFor="isPublic">
                Make public
              </label>
            </div>
            <button
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
              disabled={!pasteLimits.canCreate}
              type="submit"
            >
              Create Paste
            </button>
          </div>
          {!pasteLimits.canCreate && (
            <p className="text-destructive text-sm">
              You've reached your paste limit.{" "}
              <Link
                className="underline"
                to={href("/organizations/:organizationSlug/settings/billing", {
                  organizationSlug: params.organizationSlug,
                })}
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
