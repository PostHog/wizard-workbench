<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode SaaS template. Here is a summary of all changes made:

**Client-side initialization** — `app/entry.client.tsx` now initializes `posthog-js` with the `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables, enables cross-domain tracing headers (`__add_tracing_headers`), and wraps the app in `<PostHogProvider>` so all components can access PostHog via `usePostHog()`.

**Server-side middleware** — A new `app/lib/posthog-middleware.ts` file creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (automatically injected by the client SDK), and attaches the client to the React Router context via `posthog.withContext()`. This ensures server-side events are correlated with the correct browser session and user.

**Root route** — `app/root.tsx` registers the PostHog middleware alongside the existing security and i18n middleware. The `BaseErrorBoundary` now calls `posthog.captureException(error)` to automatically report unhandled React Router errors.

**Environment variables** — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` were added to `.env` and declared as optional fields in `app/utils/env.server.ts`.

**Vite config** — `vite.config.ts` was updated to include `ssr.noExternal: ["posthog-js", "@posthog/react"]` to ensure SSR compatibility.

**User identification** — In `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts`, returning users are identified with `posthog.identify(userId, { email })` and new users are identified immediately after account creation. This ensures all subsequent events (client and server) are tied to the correct person.

**Event tracking** was added to 8 files covering the full user lifecycle — from signup through onboarding, team growth, and subscription management.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user account created after OAuth/email callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Returning user authenticated and identified | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_user_account_completed` | User submitted user-account onboarding form | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User submitted organization onboarding form | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `subscription_checkout_initiated` | Stripe checkout session opened (server) | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Subscription cancellation portal opened (server) | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Subscription resume actioned (server) | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | Plan switch portal opened (server) | `app/features/billing/billing-action.server.ts` |
| `checkout_session_completed` | Stripe webhook: checkout session completed (server) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_payment_success_viewed` | Billing success page rendered after checkout | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/billing_.success.tsx` |
| `team_member_invited` | Email invite sent to new team member | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/members.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights. Use the links below to pre-fill the insight builder:

1. **Signup & login trend** — Daily `user_signed_up` and `user_logged_in` counts to monitor growth and returning usage.
   [Create insight](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events"},{"id":"user_logged_in","name":"user_logged_in","type":"events"}]})

2. **Signup → Onboarding → Subscription funnel** — Conversion funnel from `user_signed_up` → `onboarding_user_account_completed` → `onboarding_organization_completed` → `checkout_session_completed` to measure activation and monetisation.
   [Create insight](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events"},{"id":"onboarding_user_account_completed","name":"onboarding_user_account_completed","type":"events"},{"id":"onboarding_organization_completed","name":"onboarding_organization_completed","type":"events"},{"id":"checkout_session_completed","name":"checkout_session_completed","type":"events"}]})

3. **Subscription checkout conversion** — Funnel from `subscription_checkout_initiated` → `checkout_session_completed` to measure payment drop-off.
   [Create insight](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"subscription_checkout_initiated","name":"subscription_checkout_initiated","type":"events"},{"id":"checkout_session_completed","name":"checkout_session_completed","type":"events"}]})

4. **Churn signals** — Daily trend of `subscription_cancelled` events to track churn.
   [Create insight](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"subscription_cancelled","name":"subscription_cancelled","type":"events"}]})

5. **Team growth** — Daily `team_member_invited` counts to track virality and seat expansion.
   [Create insight](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"team_member_invited","name":"team_member_invited","type":"events"}]})

You can also view all events in your [PostHog project](https://us.posthog.com/project/238460/events).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
