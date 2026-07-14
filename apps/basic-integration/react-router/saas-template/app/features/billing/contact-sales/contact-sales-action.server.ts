import { parseSubmission, report } from "@conform-to/react/future";
import { parseFormData } from "@remix-run/form-data-parser";
import { data } from "react-router";

import { CONTACT_SALES_INTENT } from "./contact-sales-constants";
import { saveContactSalesFormSubmissionToDatabase } from "./contact-sales-form-submission-model.server";
import { contactSalesFormSchema } from "./contact-sales-schemas";
import type { Route } from ".react-router/types/app/routes/+types/contact-sales";
import { checkHoneypot } from "~/utils/honeypot.server";
import { badRequest } from "~/utils/http-responses.server";
import { posthogContext } from "~/utils/posthog-middleware.server";

export async function contactSalesAction({
  request,
  context,
}: Route.ActionArgs) {
  const formData = await parseFormData(request);

  // Check honeypot before validation (honeypot fields won't be in validated data)
  await checkHoneypot(Object.fromEntries(formData));

  // Validate using the same formData (following the validateFormData helper pattern)
  const submission = parseSubmission(formData, { stripEmptyValues: false });
  const result = await contactSalesFormSchema.safeParseAsync(
    submission.payload,
  );

  if (!result.success) {
    return badRequest({
      result: report(submission, {
        error: { issues: result.error.issues },
      }),
    });
  }

  switch (result.data.intent) {
    case CONTACT_SALES_INTENT: {
      const { intent: _, ...submissionData } = result.data;
      await saveContactSalesFormSubmissionToDatabase(submissionData);

      const posthog = context.get(posthogContext);
      if (posthog) {
        posthog.posthog.capture({
          distinctId: posthog.distinctId ?? "anonymous-contact-sales",
          event: "contact_sales_submitted",
          properties: {
            company_name_provided: Boolean(submissionData.companyName),
            has_message: Boolean(submissionData.message),
            used_work_email: Boolean(submissionData.workEmail),
          },
        });
      }

      return data({ result: undefined, success: true });
    }
  }
}
