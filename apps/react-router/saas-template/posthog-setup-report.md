<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode SaaS application. Here is a summary of all changes made:

## Summary of Changes

### New Files Created
- **`app/lib/posthog-middleware.server.ts`** — Server-side PostHog middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client SDK, and uses `posthog.withContext()` to correlate server events with client sessions.

### Modified Files

- **`app/entry.client.tsx`** — Initializes `posthog-js` with the project API key and host from environment variables, enables cross-origin tracing headers for client-server correlation, and wraps `HydratedRouter` in `<PostHogProvider>` to make PostHog available throughout the React tree.
- **`app/root.tsx`** — Adds `posthogMiddleware` to the root `middleware` array (runs on every request), and adds `posthog?.captureException(error)` in the `BaseErrorBoundary` component for automatic unhandled error tracking.
- **`app/utils/env.server.ts`** — Adds `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to the Zod environment validation schema so the app fails fast on startup if these keys are missing.
- **`vite.config.ts`** — Adds `ssr.noExternal: ['posthog-js', '@posthog/react']` to prevent Vite from externalizing the PostHog client packages during SSR bundling.
- **`app/routes/_user-authentication+/_anonymous-routes+/login.tsx`** — Uses `usePostHog()` and `useEffect` (synchronizing with external PostHog system) to call `posthog.identify(email)` and capture `user_logged_in` when login OTP is successfully sent.
- **`app/routes/_user-authentication+/_anonymous-routes+/register.tsx`** — Uses `usePostHog()` and `useEffect` to call `posthog.identify(email)` and capture `user_registered` when registration OTP is sent.
- **`app/features/organizations/create-organization/create-organization-action.server.ts`** — Captures `organization_created` server-side after the organization is saved to the database.
- **`app/features/billing/billing-action.server.ts`** — Captures four billing events server-side: `subscription_checkout_started`, `subscription_cancelled`, `subscription_resumed`, and `subscription_plan_switched`.
- **`app/features/billing/stripe-event-handlers.server.ts`** — Captures `checkout_session_completed` via a dedicated `posthog-node` client in the Stripe webhook handler (which runs outside the middleware context).
- **`app/features/organizations/settings/team-members/team-members-action.server.tsx`** — Captures `team_member_invited` server-side after the invitation email is successfully sent.
- **`app/features/user-accounts/settings/account/account-settings-action.server.ts`** — Captures `user_account_updated` after profile changes and `user_account_deleted` before the account is removed.

### Environment Variables Set
- `VITE_PUBLIC_POSTHOG_KEY` — PostHog project API key (set in `.env`)
- `VITE_PUBLIC_POSTHOG_HOST` — PostHog ingestion host: `https://us.i.posthog.com` (set in `.env`)

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `user_registered` | Fired client-side after a user successfully initiates email registration (OTP sent). Calls `posthog.identify()` with the user's email. | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | Fired client-side after a user successfully initiates login via email OTP. Calls `posthog.identify()` with the user's email. | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_logged_out` | Fired client-side when a user logs out. Calls `posthog.reset()` to disassociate the session. | `app/routes/_user-authentication+/logout.ts` |
| `organization_created` | Server-side event fired after a new organization is saved to the database. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | Server-side event fired when a Stripe checkout session is created for a new subscription. | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Server-side event fired when a user opens the Stripe cancellation portal. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Server-side event fired when a user resumes a subscription set to cancel at period end. | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | Server-side event fired when a user opens the Stripe portal to switch their subscription plan. | `app/features/billing/billing-action.server.ts` |
| `checkout_session_completed` | Server-side event fired in the Stripe webhook when `checkout.session.completed` is received, confirming payment. | `app/features/billing/stripe-event-handlers.server.ts` |
| `team_member_invited` | Server-side event fired after an invitation email is successfully sent to a new team member. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `user_account_updated` | Server-side event fired after a user's profile (name or avatar) is successfully updated. | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |
| `user_account_deleted` | Server-side event fired before a user's account is permanently deleted. | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Next Steps

To complete your analytics setup, create an **"Analytics basics"** dashboard in PostHog with these 5 suggested insights:

1. **User Signups & Logins** (Trends) — Track `user_registered` and `user_logged_in` over time to monitor acquisition and retention.
2. **Subscription Conversion Funnel** (Funnel) — Steps: `organization_created` → `subscription_checkout_started` → `checkout_session_completed` to measure the billing conversion rate.
3. **Subscription Health** (Trends) — Track `subscription_checkout_started`, `subscription_cancelled`, and `subscription_resumed` over time to monitor churn signals.
4. **Team Growth** (Trends) — Track `team_member_invited` alongside `organization_created` to measure viral/team-based growth.
5. **Account Churn** (Trends) — Track `user_account_deleted` vs `user_registered` to measure net user retention.

Visit your PostHog project at: **https://us.posthog.com/project/238460**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
