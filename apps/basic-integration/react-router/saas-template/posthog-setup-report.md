# PostHog post-wizard report

The wizard integrated PostHog into the React Router 7 application for browser and server runtimes. It installed the browser, React, and Node SDKs; initialized browser analytics with environment-backed configuration; added request-scoped server analytics with session correlation and shutdown flushing; enabled exception capture; and instrumented key acquisition, onboarding, organization, sales, and billing events. Autocapture and session recording remain at their SDK defaults.

| Event | Description | File |
|---|---|---|
| `user_registered` | A user account was created after authentication confirmation. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_account_onboarding_completed` | A user completed the account profile stage of onboarding. | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | An authenticated user created an organization. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `organization_onboarding_completed` | A user created their first organization during onboarding. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_invite_accepted` | An authenticated user accepted an organization invite link. | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |
| `contact_sales_submitted` | A visitor successfully submitted the contact sales form. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `checkout_started` | An organization owner started a subscription checkout. | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Stripe confirmed successful completion of a subscription checkout. | `app/routes/api+/v1+/stripe.webhooks.ts` |

## Next steps

The PostHog MCP endpoint was unavailable during setup, so the live dashboard, insights, and shareable notebook could not be created. Create an **Analytics basics (wizard)** dashboard when the endpoint is available, using the event contract above for signup/onboarding funnels, lead generation, checkout conversion, and organization creation trends.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; current verification is blocked because `DATABASE_URL` is missing and generated Prisma browser code is unavailable.
- [ ] Run the test suite — call sites that were instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
