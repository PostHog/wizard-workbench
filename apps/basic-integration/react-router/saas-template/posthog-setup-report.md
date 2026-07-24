<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) SaaS template. The integration covers client-side initialization with `posthog-js`, a server-side `posthog-node` middleware that runs on every request, user identification, 14 business events across auth, onboarding, billing, and team management flows, and error tracking in the root and general error boundaries.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user account was created after completing the OAuth or magic-link auth callback. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | An existing user completed authentication via magic link or Google OAuth. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | A user clicked the log-out button and ended their session. | `app/features/organizations/layout/nav-user.tsx` |
| `user_onboarding_profile_completed` | A user submitted their name and avatar during the onboarding profile step. | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | A new organization was created during the onboarding flow. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `additional_organization_created` | An authenticated user created an additional organization outside of onboarding. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | A user initiated a Stripe checkout session to subscribe to a paid plan. | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | A user initiated cancellation of their active subscription via the billing portal. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | A user reversed a pending cancellation and resumed their active subscription. | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_changed` | A user switched their subscription to a different pricing tier. | `app/features/billing/billing-action.server.ts` |
| `checkout_completed` | Stripe confirmed a successful checkout session and the organization subscription was activated. | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `member_invited_by_email` | An admin or owner sent an email invitation to a new member to join the organization. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | A visitor submitted the contact-sales form expressing interest in an enterprise plan. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `user_account_deleted` | A user permanently deleted their account and all associated data. | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Key integration files

- **`app/lib/posthog-middleware.ts`** — new file; React Router v7 middleware that creates a per-request `posthog-node` client, extracts `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers from the browser SDK, calls `posthog.withContext()` to associate all server-side events with the right session, and shuts down after each request.
- **`app/entry.client.tsx`** — initializes `posthog-js` before hydration and wraps the app with `<PostHogProvider>` so all components can call `usePostHog()`.
- **`app/root.tsx`** — adds `posthogMiddleware` to the root middleware array; updates `ErrorBoundary` to call `posthog.captureException()` on unhandled errors.
- **`app/entry.server.tsx`** — adds PostHog host to CSP `connect-src` so browser SDK requests are not blocked in production.
- **`vite.config.ts`** — adds `ssr.noExternal` for `posthog-js` and `@posthog/react` so they are bundled correctly in SSR builds.
- **`app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/_sidebar-layout.tsx`** — exposes `userId` in loader data; calls `posthog.identify(userId, { name, email })` in a `useEffect` so every authenticated session is linked to the database user ID.
- **`app/components/general-error-boundary.tsx`** — calls `posthog.captureException()` for unexpected (non-HTTP) errors in any route error boundary.
- **`app/features/organizations/layout/nav-user.tsx`** — captures `user_logged_out` and calls `posthog.reset()` when the logout button is clicked.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901991)
- [Signup to subscription funnel (wizard)](https://us.posthog.com/project/483112/insights/2gF1OTrI)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/ixrAqvJg)
- [Subscription checkouts vs completions (wizard)](https://us.posthog.com/project/483112/insights/sa5t3r2a)
- [Subscription churn events (wizard)](https://us.posthog.com/project/483112/insights/dOq2CAhX)
- [Member invites sent (wizard)](https://us.posthog.com/project/483112/insights/5DDj0Xb3)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
