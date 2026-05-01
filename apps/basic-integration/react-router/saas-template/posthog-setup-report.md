<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) SaaS template. Here is a summary of all changes made:

**Initialization & middleware**
- `app/entry.client.tsx` — Initialized `posthog-js` with the project token and `__add_tracing_headers` (for client→server session correlation), wrapped the app in `PostHogProvider`.
- `app/lib/posthog-middleware.server.ts` — New file: React Router middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers (set automatically by the client SDK), and exposes `context.posthog` to all server route handlers.
- `app/root.tsx` — Registered `posthogMiddleware` alongside the existing middlewares, and added `posthog?.captureException(error)` to the root `ErrorBoundary` for automatic exception tracking.
- `vite.config.ts` — Added `ssr.noExternal: ["posthog-js", "@posthog/react"]` to prevent SSR bundling errors.
- `app/utils/env.server.ts` — Added `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to the Zod environment schema for type-safe access and startup validation.

**Event tracking**

| Event | Description | File |
|---|---|---|
| `login_submitted` | User submitted login form (email magic link or Google OAuth) | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `register_submitted` | User submitted registration form (email magic link or Google OAuth) | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `onboarding_user_account_submitted` | User submitted the profile setup step during onboarding | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_submitted` | User submitted the organization setup step during onboarding | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User submitted the create organization form | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_checkout_started` | User initiated a subscription checkout session (server-side) | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User initiated subscription cancellation via Stripe portal (server-side) | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a subscription that was set to cancel at period end (server-side) | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User initiated a plan switch to a different subscription tier (server-side) | `app/features/billing/billing-action.server.ts` |
| `checkout_completed` | Stripe checkout.session.completed webhook received — subscription purchase confirmed (server-side) | `app/features/billing/stripe-event-handlers.server.ts` |
| `member_invited_by_email` | User submitted the invite-by-email form to add a team member | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `contact_sales_submitted` | User submitted the contact sales form | `app/features/billing/contact-sales/contact-sales-team.tsx` |

**User identification**
- On email login: `posthog.identify(email, { email })` is called in the form's `onSubmit` before the form submits.
- On Google login: `posthog.capture("login_submitted", { method: "google" })` is called on button click.
- The same pattern applies to registration — users are identified at the point of form submission so that all subsequent events are linked to the correct person.
- The client SDK automatically sends `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers with every request, which the server-side middleware uses to correlate server events to the same session and user.

## Next steps

We've found an existing "Analytics basics" dashboard with key insights to monitor user behavior:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/2/dashboard/1346453)
- **Subscription Conversion Funnel** — [View insight](https://us.posthog.com/project/2/insights/876Kj61f)
- **Daily Sign Ups & Sign Ins** — [View insight](https://us.posthog.com/project/2/insights/S7ZgfEVJ)
- **Subscription Revenue Events** (tracks `checkout_completed`) — [View insight](https://us.posthog.com/project/2/insights/bxo4bUnw)
- **Churn Signals** — [View insight](https://us.posthog.com/project/2/insights/1GcEqNEk)
- **Team Growth Activity** — [View insight](https://us.posthog.com/project/2/insights/BVccAOVs)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
