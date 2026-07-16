# PostHog post-wizard report

The wizard integrated PostHog across the React Router client and server. It added browser initialization with tracing headers, a server middleware that correlates request events to PostHog sessions and flushes before responses complete, and exception capture in the root error boundary. It also added conversion instrumentation for authentication starts, organization creation, checkout starts, subscription activation, contact-sales submissions, and invite acceptance. The PostHog token and host are configured only through environment variables.

| Event | Description | Instrumented in |
| --- | --- | --- |
| `signup_initiated` | A visitor submits the registration form to begin account creation. | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `login_initiated` | A visitor submits a login method. | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `organization_created` | An authenticated user successfully creates an organization during onboarding. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `checkout_started` | An organization administrator starts a subscription checkout session. | `app/features/billing/billing-action.server.ts` |
| `subscription_activated` | An organization administrator reaches the subscription success page. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/billing_.success.tsx` |
| `contact_sales_submitted` | A visitor successfully submits a contact-sales request. | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `organization_invite_accepted` | A user successfully accepts an organization invite link. | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |

## Next steps

A dashboard and notebook could not be created because the configured PostHog MCP endpoint was unavailable during this run. Once the endpoint is available, create **Analytics basics (wizard)** with funnel and trend insights based on the events listed above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
