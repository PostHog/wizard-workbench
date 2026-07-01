# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (framework mode) SaaS template. The integration covers both client-side and server-side event tracking, user identification, session correlation, and error capture across the full user journey — from landing on the pricing page through signup, onboarding, subscription, and team management.

**Key changes:**
- Initialized `posthog-js` with `PostHogProvider` in `entry.client.tsx`, wrapping the entire React tree
- Created a server-side middleware (`app/lib/posthog-middleware.ts`) using `posthog-node` that extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` tracing headers, allowing server events to be correlated with client sessions
- Registered `posthogMiddleware` at the root level in `root.tsx` so every route has access to the PostHog context
- Added `posthog?.captureException(error)` to the root `ErrorBoundary` for automatic error tracking
- Added `posthog?.identify(email)` in the login and register routes when the magic-link OTP is dispatched, linking anonymous sessions to known users
- Added 13 business events across server actions spanning auth, onboarding, billing, and team management

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user account was created after completing the OAuth/email magic-link flow. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | An existing user successfully authenticated via the OAuth/email magic-link callback. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_user_account_completed` | User completed the user-account step of onboarding by saving their name and avatar. | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | User completed the organization step of onboarding by creating their first organization. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | A user created a new organization from the organizations dashboard. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `pricing_page_viewed` | A visitor viewed the public pricing page, marking the top of the subscription conversion funnel. | `app/routes/pricing.tsx` |
| `checkout_session_opened` | An organization admin initiated a Stripe checkout session to start a subscription. | `app/features/billing/billing-action.server.ts` |
| `subscription_started` | A Stripe checkout session completed and a subscription was successfully activated. | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_plan_switched` | An organization admin switched to a different subscription plan via the billing portal. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | An organization admin resumed a subscription that was scheduled for cancellation. | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | A Stripe subscription was deleted and the cancellation was recorded for the organization. | `app/features/billing/stripe-event-handlers.server.ts` |
| `team_member_invited` | An organization admin invited a new member to the organization by email. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | A visitor submitted the contact-sales form to inquire about an enterprise plan. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787523)
- [Signup to subscription funnel](https://us.posthog.com/project/483112/insights/8KdJA16N)
- [New signups over time](https://us.posthog.com/project/483112/insights/3XFMtQHi)
- [Subscription starts vs cancellations](https://us.posthog.com/project/483112/insights/vp0lfSC6)
- [Pricing page to checkout funnel](https://us.posthog.com/project/483112/insights/KF5p6ryL)
- [Team growth & sales leads](https://us.posthog.com/project/483112/insights/ulhQ2AGO)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called when the magic-link OTP is sent (pre-verification). Consider also calling `posthog.identify()` on initial load for already-authenticated users (e.g. in the authenticated layout loader) to cover returning sessions.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
