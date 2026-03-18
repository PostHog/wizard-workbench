<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router 7 (Framework mode) SaaS template. The integration includes client-side initialization with session replay support, a server-side middleware for correlating server events with client sessions, and comprehensive event tracking across all critical user journeys including authentication, organization creation, billing, and account management.

## Changes made

| File | Change |
|------|--------|
| `app/lib/posthog.server.ts` | **Created** — Server-side PostHog middleware using React Router `createContext`. Creates a `posthog-node` client per request, extracts tracing headers, and makes the client available in all route handlers via `posthogContext`. |
| `app/entry.client.tsx` | **Modified** — Initialized `posthog-js` with project token and host, enabled `__add_tracing_headers` for client-server session correlation, wrapped the app with `PostHogProvider`. |
| `app/root.tsx` | **Modified** — Added `posthogMiddleware` to the root middleware array, added `usePostHog()` in `ErrorBoundary` to capture unhandled exceptions with `captureException`. |
| `vite.config.ts` | **Modified** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to enable SSR compatibility. |
| `.env` | **Modified** — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`. |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user completes email verification and their account is created | `app/routes/_user-authentication+/_anonymous-routes+/register.confirm.ts` |
| `user_signed_up` | Fired when a new user signs up via Google OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Fired when an existing user authenticates via email OTP or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `organization_created` | Fired when a user creates a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | Fired when a user initiates a Stripe checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Fired when a user initiates subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired when a user resumes a subscription scheduled for cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_switched` | Fired when a user switches to a different subscription plan | `app/features/billing/billing-action.server.ts` |
| `checkout_session_completed` | Fired when Stripe confirms checkout session completion (subscription activated) | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `subscription_deleted` | Fired when Stripe confirms a subscription has been deleted/expired | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `contact_sales_submitted` | Fired when a user submits the contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `account_updated` | Fired when a user updates their account profile | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |
| `account_deleted` | Fired when a user deletes their account | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Next steps

To get started with analytics, create an "Analytics basics" dashboard at https://us.posthog.com/project/2/dashboard with these recommended insights:

1. **Signup to Subscription Conversion** — Funnel: `user_signed_up` → `organization_created` → `subscription_checkout_started` → `checkout_session_completed`
2. **Daily Active Users** — Trend of `user_logged_in` (DAU math, daily interval)
3. **Subscription Health** — Trend comparing `checkout_session_completed` vs `subscription_cancelled`
4. **Contact Sales Submissions** — Trend of `contact_sales_submitted`
5. **Account Churn** — Trend of `account_deleted`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
