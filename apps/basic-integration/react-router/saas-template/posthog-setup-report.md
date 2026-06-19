# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) SaaS template. The integration covers client-side initialization, server-side event tracking via middleware, user identification, error tracking, and a reverse proxy configuration for ad-blocker resistance.

**Key changes:**
- `entry.client.tsx` — Initializes PostHog with `PostHogProvider`, configures the reverse proxy (`/ingest`), and enables session correlation with server-side events via `__add_tracing_headers`.
- `vite.config.ts` — Adds `ssr.noExternal` for `posthog-js`/`@posthog/react`, and configures the development proxy for `/ingest/static`, `/ingest/array`, and `/ingest`.
- `app/lib/posthog-middleware.server.ts` — New server-side PostHog middleware that creates a Node PostHog client per request, extracts session/user context from `X-POSTHOG-*` headers, and shuts down cleanly after each request.
- `app/root.tsx` — Adds `posthogMiddleware` to the root middleware chain and captures unhandled errors in the `ErrorBoundary` via `posthog.captureException()`.
- Client-side capture in `login.tsx` and `register.tsx` — Captures `user_login_submitted` and `user_register_submitted` with the method (email/google), and calls `posthog.identify()` with the email on form submit.
- Server-side user lifecycle events in `auth.callback.ts` and `login.confirm.ts` — Captures `user_signed_up`, `user_logged_in`, and `organization_member_joined`.
- `logout.ts` — Captures `user_logged_out` server-side; `nav-user.tsx` calls `posthog.reset()` client-side on logout.
- `onboarding-user-account-action.server.ts` — Captures `onboarding_user_account_completed`.
- `create-organization-action.server.ts` — Captures `organization_created`.
- `billing-action.server.ts` — Captures `subscription_checkout_started`, `subscription_cancelled`, and `subscription_switched`.
- `stripe-event-handlers.server.ts` — Captures `subscription_checkout_completed` in the Stripe webhook handler using a standalone PostHog Node client.
- `_sidebar-layout.tsx` — Calls `posthog.identify()` with the user ID and email on every authenticated page load, ensuring returning sessions are correctly identified.

## Events

| Event name | Description | File |
|---|---|---|
| `user_register_submitted` | Fired client-side when a user submits the registration form via email or Google OAuth. | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_login_submitted` | Fired client-side when a user submits the login form via email or Google OAuth. | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_signed_up` | Fired server-side when a brand-new user account is persisted after email or OAuth confirmation. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_signed_up` | Fired server-side when a new user authenticates via email OTP for the first time. | `app/routes/_user-authentication+/_anonymous-routes+/login.confirm.ts` |
| `user_logged_in` | Fired server-side when an existing user authenticates via OAuth callback. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Fired server-side when an existing user authenticates via email OTP confirmation link. | `app/routes/_user-authentication+/_anonymous-routes+/login.confirm.ts` |
| `user_logged_out` | Fired server-side when a user logs out of their account. | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_user_account_completed` | Fired server-side when a user finishes the user-account step of the onboarding flow. | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | Fired server-side when a user successfully creates a new organization. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | Fired server-side when a user opens a Stripe checkout session to start a subscription. | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Fired server-side when a user initiates the cancellation flow for their subscription. | `app/features/billing/billing-action.server.ts` |
| `subscription_switched` | Fired server-side when a user switches to a different subscription plan. | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Fired server-side inside the Stripe `checkout.session.completed` webhook when payment succeeds. | `app/features/billing/stripe-event-handlers.server.ts` |
| `organization_member_joined` | Fired server-side when a user accepts an organization invite link or email invite. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts`, `login.confirm.ts` |

## Next steps

We've built a dashboard and insights for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/2/dashboard/1740102)
  - Signup conversion funnel: `user_register_submitted` → `user_signed_up` → `onboarding_user_account_completed` → `organization_created`
  - Login trend: `user_logged_in` over time
  - Subscription checkout funnel: `subscription_checkout_started` → `subscription_checkout_completed`
  - Subscription churn: `subscription_cancelled` over time
  - Organization growth: `organization_created` over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
