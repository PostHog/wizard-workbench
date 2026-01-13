import { coerceFormValue } from "@conform-to/zod/v4/future";
import { createId } from "@paralleldrive/cuid2";
import { redirect } from "react-router";

import { requireUserNeedsOnboarding } from "../onboarding-helpers.server";
import { onboardingOrganizationSchema } from "./onboarding-organization-schemas";
import type { Route } from ".react-router/types/app/routes/_authenticated-routes+/onboarding+/+types/organization";
import type { PostHogContext } from "~/lib/posthog-middleware.server";
import { uploadOrganizationLogo } from "~/features/organizations/organizations-helpers.server";
import { saveOrganizationWithOwnerToDatabase } from "~/features/organizations/organizations-model.server";
import { authContext } from "~/features/user-authentication/user-authentication-middleware.server";
import { slugify } from "~/utils/slugify.server";
import { validateFormData } from "~/utils/validate-form-data.server";

export async function onboardingOrganizationAction({
  request,
  context,
}: Route.ActionArgs) {
  const { user, headers } = await requireUserNeedsOnboarding({
    context,
    request,
  });
  const { supabase } = context.get(authContext);
  const result = await validateFormData(
    request,
    coerceFormValue(onboardingOrganizationSchema),
    {
      maxFileSize: 1_000_000, // 1MB
    },
  );

  if (!result.success) {
    return result.response;
  }

  const organizationId = createId();
  const imageUrl = result.data.logo
    ? await uploadOrganizationLogo({
        file: result.data.logo,
        organizationId,
        supabase,
      })
    : "";

  const organization = await saveOrganizationWithOwnerToDatabase({
    organization: {
      id: organizationId,
      imageUrl,
      name: result.data.name,
      slug: slugify(result.data.name),
    },
    userId: user.id,
  });

  // Capture PostHog event for organization onboarding completion
  const posthog = (context as PostHogContext).posthog;
  posthog?.capture({
    distinctId: user.id,
    event: "onboarding_organization_completed",
    properties: {
      organization_id: organization.id,
      has_logo: !!result.data.logo,
      has_website: !!result.data.website,
      company_size: result.data.companySize,
      referral_sources: result.data.referralSources,
      company_types: result.data.companyTypes,
      early_access_opt_in: result.data.earlyAccessOptIn,
    },
  });

  return redirect(`/organizations/${organization.slug}`, { headers });
}
