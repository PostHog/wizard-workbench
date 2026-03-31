# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the React Router v7 (Framework mode) SaaS template. The integration covers client-side page view tracking, user identification, server-side event capture via middleware, Stripe webhook event tracking, error boundary monitoring, and billing funnel analytics.

## Summary of changes

- **`app/entry.client.tsx`** — Initialized PostHog JS with `__add_tracing_headers` for client-server session correlation, wrapped `HydratedRouter` with `PostHogProvider`
- **`app/root.tsx`** — Registered `posthogMiddleware` in the middleware chain; added `captureException` in the `ErrorBoundary`
- **`app/lib/posthog-middleware.ts`** *(new file)* — Server-side PostHog Node middleware that attaches a `PostHog` instance to route context and wraps each request with `posthog.withContext()` for automatic session correlation
- **`vite.config.ts`** — Added `ssr: { noExternal: ["posthog-js", "@posthog/react"] }` to prevent SSR bundling errors
- **`app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts`** — Captures `user_registered` (new users) and `user_logged_in` (returning users) on Supabase OTP/OAuth callback
- **`app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/_sidebar-layout.tsx`** — Calls `posthog.identify()` with user email and name on authenticated page load
- **`app/features/organizations/layout/nav-user.tsx`** — Captures `user_logged_out` and calls `posthog.reset()` on logout form submit
- **`app/features/onboarding/organization/onboarding-organization-action.server.ts`** — Captures `organization_created` with org id, name, and slug
- **`app/features/billing/billing-action.server.ts`** — Captures `subscription_checkout_started`, `subscription_cancelled`, `subscription_resumed`, and `subscription_plan_switched` via server middleware context
- **`app/features/billing/stripe-event-handlers.server.ts`** — Captures `checkout_session_completed` and `subscription_deleted` via a standalone PostHog Node client (Stripe webhook handlers have no request context)
- **`app/features/billing/create-subscription-modal-content.tsx`** — Captures `billing_period_toggled` and `pricing_plan_selected` in client-side event handlers
- **`app/features/billing/contact-sales/contact-sales-action.server.ts`** — Captures `contact_sales_submitted` with company name and work email
- **`.env`** — Set `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration via email OTP or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Fired when an existing user successfully logs in via email OTP or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | Fired when a user explicitly logs out | `app/features/organizations/layout/nav-user.tsx` |
| `organization_created` | Fired when a user completes the organization onboarding step and creates a new organization | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `subscription_checkout_started` | Fired when a user initiates a Stripe checkout session to subscribe to a plan | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Fired when a user initiates subscription cancellation via Stripe portal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired when a user resumes a subscription that was set to cancel at period end | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | Fired when a user initiates a plan switch via Stripe portal | `app/features/billing/billing-action.server.ts` |
| `checkout_session_completed` | Server-side: Fired when Stripe confirms a checkout session was completed successfully | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_deleted` | Server-side: Fired when Stripe confirms a subscription has been deleted/cancelled | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | Fired when a user submits the contact sales form for enterprise inquiries | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `billing_period_toggled` | Fired when a user switches between monthly and annual billing period on the pricing UI | `app/features/billing/create-subscription-modal-content.tsx` |
| `pricing_plan_selected` | Fired when a user clicks to subscribe to a specific pricing plan | `app/features/billing/create-subscription-modal-content.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [PostHog project dashboards](https://us.posthog.com/project/238460/dashboard)

To create an "Analytics basics" dashboard with insights for this integration, visit your PostHog project and create insights for:
1. **Registration & login funnel** — `user_registered` → `organization_created` → `subscription_checkout_started` → `checkout_session_completed`
2. **Subscription cancellation rate** — trend of `subscription_cancelled` vs `subscription_deleted` over time
3. **Billing period preference** — breakdown of `billing_period_toggled` by `billing_period` property
4. **Plan selection funnel** — `pricing_plan_selected` breakdown by `lookup_key`
5. **Enterprise interest** — trend of `contact_sales_submitted` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
