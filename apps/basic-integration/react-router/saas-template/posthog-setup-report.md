# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) SaaS template. The integration includes client-side analytics via `posthog-js`, server-side tracking via `posthog-node`, user identification and session correlation, error capture in the root ErrorBoundary, and `posthog.reset()` on logout.

## Changes summary

- **`app/entry.client.tsx`** — Initialized `posthog-js` with `tracing_headers` for client-server session correlation and wrapped the app in `PostHogProvider`.
- **`app/root.tsx`** — Added `posthogMiddleware` to the root middleware array and `posthog.captureException()` to the `ErrorBoundary`.
- **`app/lib/posthog-middleware.server.ts`** *(new)* — Server-side middleware that creates a `posthog-node` client per request, extracts session/distinct-id headers, and uses `withContext()` to correlate server events with client sessions.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR errors.
- **`app/utils/env.server.ts`** — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to the env schema.
- **`app/routes/_authenticated-routes+/_authenticated-routes-layout.tsx`** — Added a loader that returns the user's ID and a `useEffect` that calls `posthog.identify()` on every authenticated page load.
- **`app/features/organizations/layout/nav-user.tsx`** — Added `posthog.reset()` to the logout form's `onSubmit` handler.
- All other files below — Added `posthog.capture()` calls for individual business events.

## Tracked events

| Event name | Description | File |
|---|---|---|
| `registration_email_submitted` | User submits their email address to begin the email registration process. | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_signed_up` | A new user account is created after email or OAuth confirmation. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | An existing user successfully completes authentication via email or OAuth. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_completed` | User completes the onboarding flow by creating their organization. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | User creates a new organization from the organizations page. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `checkout_session_started` | User initiates a subscription checkout session to subscribe to a plan. | `app/features/billing/billing-action.server.ts` |
| `subscription_started` | A Stripe checkout session is completed and the subscription is activated. | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `subscription_cancelled` | User starts the subscription cancellation flow via the billing portal. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumes a subscription that was previously set to cancel at period end. | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User initiates a plan switch to a different subscription tier. | `app/features/billing/billing-action.server.ts` |
| `member_invited` | An organization admin invites a new member to join via email. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `member_role_changed` | An organization admin changes a member's role or deactivates their account. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | User submits the contact sales form to inquire about enterprise plans. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816784)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/L0RfafCy)
- [Signup-to-subscription conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/3jmQnogP)
- [Subscription events over time (wizard)](https://us.posthog.com/project/483112/insights/EJZqvo1N)
- [Organization growth over time (wizard)](https://us.posthog.com/project/483112/insights/4QREkqEA)
- [Team growth and sales leads (wizard)](https://us.posthog.com/project/483112/insights/0TxZXP9a)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the authenticated layout loader calls `posthog.identify(userId)` on every render, but verify this fires correctly after a hard refresh or new session.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
