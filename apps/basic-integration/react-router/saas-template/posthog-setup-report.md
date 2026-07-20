# PostHog post-wizard report

The wizard integrated PostHog into this React Router 7 Framework application for browser and server analytics. It installed `posthog-js`, `@posthog/react`, and `posthog-node`; initialized browser analytics with the project environment variables; added request-scoped server analytics with session/distinct-ID correlation and awaited shutdown; enabled exception autocapture; added client and server error reporting; identifies authenticated returning users; resets identity on logout; and instruments key acquisition, onboarding, organization, billing, team, sales, and churn actions. Autocapture and session recording remain at their SDK defaults.

| Event | Description | File |
|---|---|---|
| `login_link_requested` | A user successfully requested a login link or began Google login. | `app/features/user-authentication/login/login-action.server.ts` |
| `registration_requested` | A user successfully requested registration or began Google registration. | `app/features/user-authentication/registration/register-action.server.ts` |
| `user_account_onboarding_completed` | A user completed the account details step of onboarding. | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | A user created an organization. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `checkout_started` | An organization owner successfully opened a subscription checkout session. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | An organization owner resumed a subscription scheduled for cancellation. | `app/features/billing/billing-action.server.ts` |
| `team_member_invited` | An organization administrator successfully sent a team invitation. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `organization_deleted` | An organization owner permanently deleted an organization. | `app/features/organizations/settings/general/general-organization-settings-action.server.ts` |
| `user_account_deleted` | A user permanently deleted their account. | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |
| `contact_sales_submitted` | A visitor successfully submitted the contact sales form. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `checkout_completed` | Stripe confirmed successful completion of a subscription checkout. | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `subscription_cancelled` | Stripe confirmed that a customer subscription was deleted. | `app/routes/api+/v1+/stripe.webhooks.ts` |

## Next steps

The dashboard and notebook could not be created because the PostHog MCP endpoint was unavailable during this run. Once access is restored, create **Analytics basics (wizard)** with an acquisition-to-checkout funnel, onboarding funnel, checkout completion trend, subscription cancellation trend, and account/organization deletion trend.

## Verification performed

- Targeted Biome checks passed for all files touched by the integration.
- The full typecheck was blocked because `DATABASE_URL` is not configured, so Prisma generation could not run.
- The production build reached Vite compilation but was blocked by the pre-existing missing generated module `~/generated/browser`.

## Verify before merging

- [ ] Run a full production build after configuring `DATABASE_URL` and generating the Prisma client, then fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or a bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the authenticated returning-visitor path invokes `identify` with the stable user account ID in a production-like session.

### Agent skill

We've left an agent skill folder in the project. You can use this context for further agent development when using Claude Code. This helps ensure the model uses current approaches for integrating PostHog.
