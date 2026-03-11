# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 Framework mode SaaS template. The following changes were made:

- **Installed packages**: `posthog-js`, `@posthog/react`, and `posthog-node` were added as dependencies.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` were added to `.env` and exposed via `app/utils/env.server.ts`.
- **Server middleware** (`app/lib/posthog-middleware.ts`): A React Router v7 middleware creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` tracing headers from `posthog-js`, and links server events to the client session via `posthog.withContext()`.
- **Client initialisation** (`app/entry.client.tsx`): `posthog-js` is initialised with `__add_tracing_headers` so all requests carry the session and distinct-ID headers that the middleware reads.
- **React provider** (`app/entry.client.tsx`): `HydratedRouter` is wrapped in `<PostHogProvider>` so all React components can call `usePostHog()`.
- **Root middleware** (`app/root.tsx`): `posthogMiddleware` is added to the middleware chain alongside the existing security and i18n middlewares.
- **Error tracking** (`app/root.tsx`): The root `ErrorBoundary` calls `posthog.captureException(error)` for non-404 errors.
- **Auth events** (`login.tsx`, `register.tsx`): `posthog.identify()` and event captures fire client-side when the OTP email is sent, using a `useRef` guard to avoid duplicate calls.
- **OAuth callback** (`auth.callback.ts`): Server-side capture of `user_auth_callback_completed` with `is_new_user` property distinguishes sign-ups from logins via Google/magic-link.
- **Logout** (`logout.ts`): Server-side capture of `user_logged_out`.
- **Onboarding** (`onboarding-user-account-action.server.ts`, `onboarding-organization-action.server.ts`): Step-completion events with relevant properties (`has_avatar`, `has_logo`, `organization_id`).
- **Billing** (`billing-action.server.ts`): Four in-app billing events covering checkout start, plan switch, cancellation, and resumption.
- **Stripe webhooks** (`stripe-event-handlers.server.ts`): Three webhook-triggered events (`checkout_session_completed`, `subscription_created`, `subscription_deleted`) using a standalone `createWebhookPostHog()` factory since Stripe webhook handlers don't run through the middleware chain.
- **Vite config** (`vite.config.ts`): Added `ssr.noExternal: ['posthog-js', '@posthog/react']` for SSR compatibility.

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user initiates registration (OTP sent) via email or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | Fired when a user initiates login (OTP sent) via email or Google OAuth; also used for client-side identify | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_auth_callback_completed` | Fired server-side when the OAuth/magic-link callback is exchanged for a session — distinguishes new vs. returning users | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | Fired server-side when the user explicitly logs out | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_user_account_completed` | Fired when the user finishes the user-account step of onboarding (name + avatar saved) | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | Fired when the user finishes the organization step of onboarding (org created) | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `subscription_checkout_started` | Fired server-side when a Stripe checkout session is created (user clicked subscribe) | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Fired server-side when a user initiates a subscription cancel flow | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired server-side when a user resumes a subscription that was set to cancel at period end | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | Fired server-side when a user initiates a plan-switch via the Stripe portal | `app/features/billing/billing-action.server.ts` |
| `subscription_created` | Fired server-side via Stripe webhook when a subscription is successfully created | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_deleted` | Fired server-side via Stripe webhook when a subscription is fully deleted/expired | `app/features/billing/stripe-event-handlers.server.ts` |
| `checkout_session_completed` | Fired server-side via Stripe webhook when a checkout session completes (payment confirmed) | `app/features/billing/stripe-event-handlers.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. To create them in PostHog, go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and create a new dashboard called **"Analytics basics"** with the following insights:

1. **New sign-ups over time** — Trends chart for `user_signed_up`, grouped by day. Tracks user acquisition.
2. **Signup → Onboarding → Subscription funnel** — Funnel: `user_auth_callback_completed` (is_new_user=true) → `onboarding_organization_completed` → `subscription_checkout_started`. Measures activation rate.
3. **Subscription checkout conversion** — Funnel: `subscription_checkout_started` → `checkout_session_completed`. Measures payment completion rate.
4. **Subscription churn trend** — Trends chart for `subscription_deleted` and `subscription_cancelled`, grouped by day. Tracks churn signals.
5. **Subscription growth** — Trends chart comparing `subscription_created` vs `subscription_deleted` over time. Shows net subscription growth.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
