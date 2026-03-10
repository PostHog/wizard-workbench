<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router 7 (Framework mode) SaaS application. PostHog is now initialized on the client side via `posthog-js` and `@posthog/react`, and a server-side middleware using `posthog-node` runs on every request to correlate server events with client sessions.

**Key changes made:**

- **`app/entry.client.tsx`** — Initializes `posthog-js` with tracing headers and wraps the app with `<PostHogProvider>`, enabling `usePostHog()` throughout the component tree.
- **`app/root.tsx`** — Added `posthogMiddleware` to the root middleware chain and added `posthog?.captureException(error)` to `BaseErrorBoundary` for automatic error tracking.
- **`app/lib/posthog-middleware.server.ts`** _(new)_ — Creates a per-request PostHog Node client, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` from request headers, and attaches it to the route context so all server-side handlers can capture events correlated to the correct user session.
- **`app/utils/env.server.ts`** — Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to the validated environment schema.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling issues.
- **`.env`** — Environment variables `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` set.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | New user authenticated via magic link or OAuth callback for the first time | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Returning user authenticated via magic link or OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | User triggered the logout action | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_user_account_completed` | User completed the user-account onboarding step (name + avatar) | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | User created a new organization successfully | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | User initiated Stripe checkout for a subscription plan | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User opened the Stripe cancellation portal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a subscription set to cancel at period end | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switched to a different subscription plan via portal | `app/features/billing/billing-action.server.ts` |
| `checkout_session_completed` | Stripe webhook confirmed a checkout session completed (subscription activated) | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | User submitted the contact-sales enterprise inquiry form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `team_member_invited` | Admin invited a team member via email invite | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |

## Next steps

To view insights based on these events, open your PostHog project and create an **"Analytics basics"** dashboard with the following recommended insights:

1. **User signup trend** — Trends chart of `user_signed_up` over time (daily/weekly)
2. **Signup → Onboarding → Org creation funnel** — Funnel: `user_signed_up` → `onboarding_user_account_completed` → `organization_created`
3. **Subscription conversion funnel** — Funnel: `subscription_checkout_started` → `checkout_session_completed`
4. **Churn events** — Trends chart of `subscription_cancelled` events over time
5. **Team growth** — Trends chart of `team_member_invited` events per organization

Navigate to [PostHog → Insights](https://us.posthog.com/project/2/insights) to build these.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
