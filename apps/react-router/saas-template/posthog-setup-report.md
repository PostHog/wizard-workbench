<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 Framework mode SaaS application. Here is a summary of all changes made:

**New files created:**
- `app/lib/posthog-middleware.server.ts` — Server-side PostHog middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` tracing headers set by the client SDK, and associates all server-side events with the correct user session via `withContext()`.

**Modified files:**
- `app/entry.client.tsx` — Initialises `posthog-js` with tracing headers enabled and wraps the app in `PostHogProvider` for client-side access via `usePostHog()`.
- `app/root.tsx` — Adds `posthogMiddleware` to the root middleware array and captures unhandled exceptions in the `ErrorBoundary` via `posthog.captureException()`.
- `app/utils/env.server.ts` — Adds `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to the Zod environment schema.
- `vite.config.ts` — Adds `posthog-js` to `ssr.noExternal` and configures a `/ingest` dev proxy to the PostHog host.
- 10 server-side action/handler files — PostHog capture calls added (see table below).

**Packages installed:** `posthog-js`, `posthog-node`

**Environment variables set in `.env`:** `VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`

---

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully initiates registration with email OTP or Google OAuth | `app/features/user-authentication/registration/register-action.server.ts` |
| `user_logged_in` | Fired when an existing user successfully initiates login with email OTP or Google OAuth | `app/features/user-authentication/login/login-action.server.ts` |
| `user_signed_up_completed` | Fired in auth callback when a brand-new user account is saved to the database (first-time sign-up confirmed) | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_user_account_completed` | Fired when a user successfully completes the user account onboarding step (name + avatar) | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_created` | Fired when a user creates their first organization during onboarding | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | Fired when an authenticated user creates a new organization (post-onboarding) | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `team_member_invited` | Fired when an admin/owner successfully sends an email invite to a new team member | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `team_member_role_changed` | Fired when an admin/owner changes a team member's role or deactivates them | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `subscription_checkout_started` | Fired when a user initiates a Stripe checkout session to subscribe | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Fired when a user initiates a subscription cancellation flow via Stripe portal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired when a user successfully resumes a subscription scheduled for cancellation | `app/features/billing/billing-action.server.ts` |
| `checkout_session_completed` | Server-side: Fired when Stripe webhook confirms `checkout.session.completed` (payment received) | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | Fired when a visitor successfully submits the contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `user_account_deleted` | Fired when a user successfully deletes their own account | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

---

## Next steps

We've designed 5 insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Create them in PostHog using the links below:

**Dashboard:** [Analytics basics — create new](https://us.posthog.com/project/2/dashboard/new)

Once you've created the dashboard, add these 5 insights to it:

1. **User Signup Funnel** — Funnel: `user_registered` → `user_signed_up_completed` → `onboarding_user_account_completed` → `onboarding_organization_created` (last 30 days, 7-day conversion window)
   [Create insight](https://us.posthog.com/project/2/insights/new)

2. **Subscription Conversion (Checkout → Payment)** — Trend: `subscription_checkout_started` vs `checkout_session_completed`, daily, last 30 days
   [Create insight](https://us.posthog.com/project/2/insights/new)

3. **Churn vs Recovery** — Trend: `subscription_cancelled` vs `subscription_resumed`, weekly, last 90 days
   [Create insight](https://us.posthog.com/project/2/insights/new)

4. **Daily Active Users (Logins)** — Trend: unique users with `user_logged_in`, daily, last 30 days
   [Create insight](https://us.posthog.com/project/2/insights/new)

5. **Contact Sales Pipeline** — Trend: `contact_sales_submitted`, bar chart, daily, last 90 days
   [Create insight](https://us.posthog.com/project/2/insights/new)

> **Note:** The PostHog API key provided to the wizard has read-only scopes and does not have `dashboard:write` or `insight:write` permissions, so the dashboard and insights could not be created automatically. Use the links above to create them in the PostHog UI.

---

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
