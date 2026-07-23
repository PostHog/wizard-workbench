<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS project. The integration covers client-side initialization with a reverse proxy, SPA pageview tracking, user identification on login/signup/refresh, and server-side event capture across all critical business API routes.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization (Next.js 15.3+ pattern) with exception autocapture enabled
- `lib/posthog-server.ts` — Singleton server-side PostHog client (posthog-node) with flush-per-request configuration
- `.env.local` — PostHog public token and host environment variables

**Files modified:**
- `next.config.ts` — Added reverse proxy rewrites for `/ingest/*` and `skipTrailingSlashRedirect: true`
- `pages/_app.tsx` — Added `PostHogUser` component for user identification on page refresh and SPA `$pageview` tracking on route changes
- `components/login.tsx` — Added `user_signed_in`/`user_signed_up` capture, `X-POSTHOG-DISTINCT-ID`/`X-POSTHOG-SESSION-ID` headers for server correlation, and exception capture
- `components/header.tsx` — Added `user_signed_out` capture and `posthog.reset()` on sign-out
- `pages/pricing.tsx` — Added `checkout_initiated` capture in the pricing plan form handler
- `pages/api/auth/sign-in.ts` — Added server-side `user_signed_in` with identify + alias for client/server correlation
- `pages/api/auth/sign-up.ts` — Added server-side `user_signed_up` with identify + alias
- `pages/api/stripe/create-checkout.ts` — Added `checkout_session_created` capture
- `pages/api/stripe/webhook.ts` — Added `subscription_updated` and `subscription_cancelled` from Stripe webhook events
- `pages/api/team/invite.ts` — Added `team_member_invited` capture
- `pages/api/team/remove-member.ts` — Added `team_member_removed` capture
- `pages/api/account/update.ts` — Added `account_updated` capture + person property identify
- `pages/api/stripe/customer-portal.ts` — Added `customer_portal_opened` capture

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_initiated` | User clicked Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_session_created` | Server created a Stripe checkout session | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | A Stripe subscription was updated via webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | A Stripe subscription was cancelled via webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | User sent an invitation to a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | User removed a member from their team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account name or email | `pages/api/account/update.ts` |
| `customer_portal_opened` | User accessed the Stripe customer billing portal | `pages/api/stripe/customer-portal.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1897466)
- [Signup conversion funnel](https://us.posthog.com/project/483112/insights/10403393)
- [Signups trend](https://us.posthog.com/project/483112/insights/10403394)
- [Checkout conversion funnel](https://us.posthog.com/project/483112/insights/10403397)
- [Subscription cancellations trend](https://us.posthog.com/project/483112/insights/10403398)
- [Team growth trend](https://us.posthog.com/project/483112/insights/10403410)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogUser` component in `_app.tsx` handles this via SWR, but verify it fires correctly for authenticated sessions that skip the login form.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
