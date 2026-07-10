# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode SaaS template. The integration adds client-side session recording and autocapture via `posthog-js`, server-side event tracking via `posthog-node` using a React Router middleware, user identification on login and reset on logout, error boundary tracking, and 13 business-critical events covering the full user lifecycle from signup through billing.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user account was created after email or OAuth verification. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | An existing user successfully authenticated via email OTP or OAuth callback. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | A user signed out of their account. | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_user_account_completed` | User completed the first onboarding step by saving their profile name and avatar. | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | User completed onboarding by creating their first organization. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | An authenticated user created an additional organization. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_initiated` | User started the Stripe checkout flow to subscribe to a paid plan. | `app/features/billing/billing-action.server.ts` |
| `checkout_session_completed` | Stripe confirmed a checkout session was completed and the organization was upgraded. | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `subscription_cancelled` | User initiated cancellation of their active subscription. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a subscription that was set to cancel at period end. | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User initiated a plan switch to a different subscription tier. | `app/features/billing/billing-action.server.ts` |
| `member_invited` | An admin sent an email invitation to a new team member. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `member_role_changed` | An admin changed an existing team member's role or deactivated them. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |

## Files created or modified

- **Created** `app/lib/posthog-middleware.ts` — PostHog Node.js server middleware; initialises a `PostHog` client per request, extracts `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers from the client SDK for session correlation, and shuts the client down after each request.
- **Modified** `app/entry.client.tsx` — Initialises `posthog-js` with `tracing_headers` so the client SDK injects its distinct/session IDs into server-bound requests, and wraps the app with `<PostHogProvider>`.
- **Modified** `app/root.tsx` — Registers `posthogMiddleware` at the top of the middleware stack and adds `posthog.captureException()` in the `ErrorBoundary`.
- **Modified** `vite.config.ts` — Adds `ssr: { noExternal: ['posthog-js', '@posthog/react'] }` to prevent SSR bundling issues.
- **Modified** `app/features/organizations/layout/nav-user.tsx` — Calls `posthog.identify(userId, { email, name })` via `useEffect` on mount and `posthog.reset()` on logout form submit.
- **Modified** `app/features/organizations/layout/layout-helpers.server.ts` — Passes `user.id` to `navUserProps` so the `NavUser` component has a stable distinct ID for `identify`.
- **Modified** `app/features/organizations/layout/nav-user.test.tsx` — Updated factory to include the new required `id` field.
- **Modified** `.env` — Added `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST`.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829381)
- [New signups over time](https://us.posthog.com/project/483112/insights/LrOl0P60) — Daily line chart of `user_signed_up`
- [Onboarding funnel](https://us.posthog.com/project/483112/insights/Gn6eyRuB) — Signup → profile completed → organization created
- [Subscription checkout funnel](https://us.posthog.com/project/483112/insights/blCLkrm8) — Checkout initiated → session completed
- [Subscription cancellations vs resumptions](https://us.posthog.com/project/483112/insights/zIYCMhDD) — Weekly churn vs recovery
- [Member invitations sent](https://us.posthog.com/project/483112/insights/3TcTBCMj) — Weekly invite volume (product virality signal)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — `nav-user.test.tsx` was updated but the other call sites that depend on `NavUserProps` should also be verified.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog error tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — `NavUser` does this on every mount (including page refresh), which covers returning sessions, but verify the onboarding routes also reach an identified state before capturing events.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
