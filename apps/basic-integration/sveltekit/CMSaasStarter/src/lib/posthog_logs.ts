import posthog from "posthog-js"

export const posthogLog = {
  contactRequestSubmitted() {
    posthog.logger.info("contact request submitted", {
      action: "contact_request_submitted",
    })
  },

  profileCreated() {
    posthog.logger.info("profile created", {
      action: "profile_created",
    })
  },

  planSelected(planId: string) {
    posthog.logger.info("plan selected", {
      action: "plan_selected",
      plan_id: planId,
    })
  },
}
