<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router v7 (Framework mode) SaaS template. The setup covers both **client-side** and **server-side** event tracking, user identification, exception capture, and Stripe billing analytics.

## What was changed

- **`app/entry.client.tsx`** — PostHog JS SDK initialized with `posthog.init()` and `PostHogProvider` wrapping the app. The `__add_tracing_headers` option automatically correlates client and server events via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers.
- **`app/lib/posthog-middleware.ts`** *(new)* — Server-side PostHog middleware that creates a per-request `PostHog` Node client, sets up session/user context from tracing headers, and shuts down cleanly after each request.
- **`app/root.tsx`** — PostHog middleware registered first in the root middleware array; `ErrorBoundary` wired up with `posthog.captureException()` for automatic error tracking.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR import errors.
- All event files listed below were updated with targeted PostHog capture calls.

## Event tracking summary

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | User submitted the email/Google registration form (client) or completed OAuth (server) | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx`, `auth.callback.ts` |
| `user_logged_in` | User submitted the login form with `method: "email"` or `method: "google"` property | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_logged_out` | Server-side capture when logout action is invoked | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_user_account_completed` | User completed the user account onboarding step | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `organization_created` | User submitted the create organization form | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_cancelled` | User confirmed subscription cancellation in the billing dialog | `app/features/billing/billing-page.tsx` |
| `subscription_resumed` | User resumed a pending-cancellation subscription | `app/features/billing/billing-page.tsx` |
| `subscription_plan_switched` | User switched subscription plan (upgrade or downgrade) | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `team_member_invited` | Admin sent an email invite to a team member | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `organization_invite_accepted` | User accepted an email invite or invite link (server-side) | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `checkout_session_completed` | Stripe checkout session completed — new subscriber (server-side) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_created_stripe` | Stripe subscription created event received (server-side) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_deleted_stripe` | Stripe subscription deleted event received — involuntary churn (server-side) | `app/features/billing/stripe-event-handlers.server.ts` |

## Next steps

We recommend building the following insights and dashboard in your PostHog project to monitor business-critical metrics:

### Recommended dashboard: "Analytics basics"

Head to [PostHog Project 238460](https://us.posthog.com/project/238460) and create a new dashboard called **"Analytics basics"** with these five insights:

1. **User Activation Funnel** — Conversion funnel: `user_registered` → `onboarding_user_account_completed` → `organization_created` → `checkout_session_completed`. Shows where users drop off between registration and becoming paying customers.

2. **Daily Active Users (Login Trend)** — Trends insight: `user_logged_in` count over time (daily). Measures user engagement and retention.

3. **Subscription Revenue Events** — Trends insight: `checkout_session_completed` and `subscription_created_stripe` over time. Shows new revenue velocity.

4. **Churn Signals** — Trends insight: `subscription_cancelled` and `subscription_deleted_stripe` over time. Tracks voluntary and involuntary churn.

5. **Viral Growth (Invite Funnel)** — Funnel: `team_member_invited` → `organization_invite_accepted`. Shows team expansion rate and invite conversion.

You can create these at: [https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
