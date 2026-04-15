<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) SaaS template. The integration covers client-side event tracking, server-side middleware, error tracking, and user identification across the full authentication and billing lifecycle.

**Key changes made:**

- **`app/entry.client.tsx`** — PostHog JS initialized with `posthog.init()` and the app wrapped with `<PostHogProvider>`. Tracing headers (`__add_tracing_headers`) are enabled so client sessions are correlated with server-side events.
- **`app/lib/posthog-middleware.ts`** — New file: a React Router middleware that creates a server-side PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and exposes the client via `context.posthog` for all route handlers.
- **`app/root.tsx`** — `posthogMiddleware` added to the root middleware array (runs on every request). `usePostHog().captureException()` added to `BaseErrorBoundary` for automatic error tracking.
- **`app/utils/env.server.ts`** — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` added to the env schema (optional) so they are validated at startup.
- **`vite.config.ts`** — `ssr.noExternal: ['posthog-js', '@posthog/react']` added to fix SSR bundling.
- **`app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts`** — Server-side `user_logged_in` and `user_registered` events captured at the OAuth callback, differentiating returning users from new signups.
- **`app/features/billing/stripe-event-handlers.server.ts`** — Server-side `checkout_session_completed`, `subscription_created`, and `subscription_deleted` events captured via a lightweight PostHog Node client inside the Stripe webhook handlers.
- **`app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/billing_.success.tsx`** — Client-side `billing_success_viewed` event captured on mount (top of the revenue funnel confirmation).
- **`app/routes/_authenticated-routes+/onboarding+/organization.tsx`** — Client-side `onboarding_organization_completed` event captured on form submit.
- **`app/features/billing/billing-page.tsx`** — Client-side `subscription_cancelled` and `subscription_resumed` events captured on form submit.
- **`app/features/billing/cancel-or-modify-subscription-modal-content.tsx`** — Client-side `subscription_plan_changed` event captured when a plan switch form is submitted.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired server-side when a returning user completes OAuth login | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_registered` | Fired server-side when a new user account is created | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_organization_completed` | Fired client-side when user submits the organization onboarding form | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `billing_success_viewed` | Fired client-side when user lands on the billing success page (post-checkout) | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/billing_.success.tsx` |
| `subscription_cancelled` | Fired client-side when user confirms subscription cancellation | `app/features/billing/billing-page.tsx` |
| `subscription_resumed` | Fired client-side when user resumes a subscription set to cancel | `app/features/billing/billing-page.tsx` |
| `subscription_plan_changed` | Fired client-side when user switches to a different plan tier/interval | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `checkout_session_completed` | Fired server-side when Stripe checkout session completes (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_created` | Fired server-side when a new Stripe subscription is created (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_deleted` | Fired server-side when a Stripe subscription is deleted (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |

## Next steps

We've instrumented key business events. To visualize them, create an **"Analytics basics"** dashboard in PostHog with the following insights:

**Recommended dashboard:** https://us.posthog.com/project/2/dashboards

Create the following 5 insights on the dashboard:

1. **Signup funnel** — Conversion funnel: `user_registered` → `onboarding_organization_completed` → `billing_success_viewed`. Shows where new users drop off before becoming paying customers.

2. **New registrations over time** — Trend of `user_registered` events. Tracks growth in new signups day-over-day or week-over-week.

3. **Subscription revenue events** — Trend of `checkout_session_completed` and `subscription_created` side-by-side. Tracks new subscriptions entering the system.

4. **Churn signals** — Trend of `subscription_cancelled` and `subscription_deleted` events. Monitor cancellations to spot churn spikes early.

5. **Plan change distribution** — Breakdown of `subscription_plan_changed` by `lookup_key` property. Shows which tiers customers are moving to/from.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
