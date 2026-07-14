# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog client-side initialization was added to the React Router framework entrypoint, server-side request middleware was added with `posthog-node`, public PostHog environment variables were wired through the app env loader, authenticated users are identified on the server, exceptions are captured in the root error boundary, and product events were instrumented across authentication, onboarding, paste management, billing, invite acceptance, contact sales, and selected Stripe webhook flows.

| Event name | Description | File |
| --- | --- | --- |
| login_submitted | Captures when a visitor submits the login form with a chosen sign-in method. | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| registration_submitted | Captures when a visitor submits the registration form with a chosen sign-up method. | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| user_logged_out | Captures when an authenticated user logs out. | `app/routes/_user-authentication+/logout.ts` |
| organization_created | Captures when an authenticated user successfully creates an organization. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| onboarding_organization_completed | Captures when a user finishes the onboarding organization step. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| onboarding_user_account_completed | Captures when a user finishes the onboarding account step. | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| paste_created | Captures when a user successfully creates a new paste. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| paste_deleted | Captures when a user deletes an existing paste. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| billing_checkout_started | Captures when an organization owner starts a billing checkout flow. | `app/features/billing/billing-action.server.ts` |
| billing_portal_opened | Captures when a user opens billing invoices or plan management in Stripe. | `app/features/billing/billing-action.server.ts` |
| contact_sales_submitted | Captures when a visitor submits the contact sales form. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| invite_link_accepted | Captures when a user successfully joins an organization through an invite link. | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |
| stripe_webhook_processed | Captures when important Stripe webhook events are processed successfully. | `app/routes/api+/v1+/stripe.webhooks.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846862)
- [Organization creation trend (wizard)](https://us.posthog.com/project/483112/insights/TefltdxE)
- [Onboarding completion funnel (wizard)](https://us.posthog.com/project/483112/insights/zBpr3zYY)
- [Paste activity trend (wizard)](https://us.posthog.com/project/483112/insights/tjM8ooZc)
- [Billing intents by event (wizard)](https://us.posthog.com/project/483112/insights/TrAZj1z0)
- [Acquisition intent mix (wizard)](https://us.posthog.com/project/483112/insights/iqw5XH73)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap/setup scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or equivalent bundler step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` for already-authenticated sessions in production environments.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
