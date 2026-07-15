# PostHog post-wizard report

The wizard completed a React Router 7 Framework-mode PostHog integration. It installed the browser, React, and Node SDKs; configured the PostHog token and host through environment variables; initialized browser analytics with request tracing; added server-side request context and exception capture; and instrumented organization, billing, invitation, sales-contact, and Stripe checkout flows. Browser and server errors are captured without disabling any default PostHog collection.

| Event | Description | File |
| --- | --- | --- |
| `organization_created` | Captures a completed organization creation after it is persisted. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `onboarding_organization_created` | Captures completion of the organization step during onboarding. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `checkout_started` | Captures a successful request to open a subscription checkout session. | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Captures a completed subscription cancellation request. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Captures a completed subscription resumption request. | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_change_started` | Captures a successful request to start a subscription plan change. | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Captures Stripe-confirmed checkout completion from the billing webhook. | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `team_invite_sent` | Captures a successfully sent organization member invitation. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | Captures a successfully submitted enterprise sales inquiry. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |

## Next steps

The PostHog MCP endpoint was unavailable in this run, so a dashboard and accompanying insights could not be created. Once the endpoint is available, create **Analytics basics (wizard)** with views for checkout started-to-completed conversion, subscription cancellation and resumption, organization creation, member invitations, and sales-contact submissions.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

An agent skill folder has been left in the project for future PostHog-related development.
