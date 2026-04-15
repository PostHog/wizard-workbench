<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 (Framework mode) SaaS template. Here is a summary of all changes made:

**Infrastructure**
- Installed `posthog-js`, `posthog-node`, and `@posthog/react` packages
- Created `app/utils/posthog-middleware.server.ts` — a React Router v7 middleware that initialises a PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers sent by the browser SDK, and calls `posthog.withContext()` to correlate server-side events with the correct session and user
- Registered the middleware globally in `app/root.tsx` alongside the existing security and i18n middleware
- Updated `app/utils/env.server.ts` to validate and expose `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` via the schema and `getEnv()`
- Updated `vite.config.ts` to add `ssr: { noExternal: ['posthog-js', '@posthog/react'] }`, required for SSR builds
- Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in `.env`

**Client-side initialisation**
- Updated `app/entry.client.tsx` to initialise `posthog-js` (with `defaults: '2026-01-30'` and `__add_tracing_headers` for automatic session correlation) and wrap the app with `<PostHogProvider>`
- Added `usePostHog()` + `posthog?.identify()` in the sidebar layout (`_sidebar-layout.tsx`) so the user is identified client-side on every authenticated page load, with `email` and `name` as person properties

**Error tracking**
- Updated the root `ErrorBoundary` in `app/root.tsx` to call `posthog?.captureException(error)` for all non-404 errors

**Event tracking**

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user account created after auth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Existing user authenticated via auth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | User logged out of the application | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_organization_completed` | User completed the organization onboarding step | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | Authenticated user created an additional organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `member_invited_by_email` | Owner or admin sent an email invitation to a new team member | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `subscription_checkout_started` | User opened a Stripe checkout session to subscribe | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User initiated a subscription cancellation via Stripe portal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a subscription scheduled to cancel | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User initiated a plan switch via Stripe portal | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Stripe webhook confirmed checkout session completed | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | User submitted the contact sales form (enterprise) | `app/features/billing/contact-sales/contact-sales-action.server.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights, using the events instrumented above:

1. **User Acquisition Funnel** — Funnel from `user_signed_up` → `onboarding_organization_completed` → `organization_created`
2. **New Signups Over Time** — Trend of `user_signed_up` event count per day
3. **Subscription Conversion Funnel** — Funnel from `subscription_checkout_started` → `subscription_checkout_completed`
4. **Subscription Churn** — Trend of `subscription_cancelled` over time
5. **Team Growth** — Trend of `member_invited_by_email` over time

You can create these here:
- [Create a new dashboard](https://us.posthog.com/project/2/dashboards/)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)
- [View all events](https://us.posthog.com/project/2/data-management/events)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
