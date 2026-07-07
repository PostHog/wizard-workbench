<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS starter. The following changes were made:

- **`instrumentation-client.ts`** (new) — Client-side PostHog initialization using the Next.js 15.3+ instrumentation hook, with session replay, exception capture, and a `/ingest` reverse proxy.
- **`next.config.ts`** — Added rewrites to proxy PostHog ingestion through `/ingest/*`, avoiding ad blockers.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog Node.js client used by all API routes.
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` added.
- **`pages/_app.tsx`** — Calls `posthog.identify()` on page load when a logged-in user's data is already available via SWR fallback.
- **`components/login.tsx`** — Captures `sign_in_submitted` / `sign_up_submitted` (with success flag), passes `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers to the auth API, and calls `posthog.captureException()` on unexpected errors.
- **`components/header.tsx`** — Calls `posthog.reset()` after the sign-out API call completes.
- **`pages/pricing.tsx`** — Captures `checkout_initiated` with `price_id` and `plan` properties when the user clicks Get Started.
- **`pages/dashboard/general.tsx`** — Captures `account_updated` after a successful account save.
- **`pages/api/auth/sign-in.ts`** — Captures `user_signed_in`, calls `posthog.identify()`, and aliases the anonymous client ID to the server user ID.
- **`pages/api/auth/sign-up.ts`** — Captures `user_signed_up`, calls `posthog.identify()`, and aliases the anonymous client ID.
- **`pages/api/auth/sign-out.ts`** — Captures `user_signed_out` on the server before clearing the session cookie.
- **`pages/api/stripe/create-checkout.ts`** — Captures `checkout_session_created` when a Stripe session is created.
- **`pages/api/stripe/customer-portal.ts`** — Captures `customer_portal_accessed` when a user opens the billing portal.
- **`pages/api/team/invite.ts`** — Captures `team_member_invited` with `role` and `team_id`.
- **`pages/api/team/remove-member.ts`** — Captures `team_member_removed` with `team_id` and `member_id`.
- **`lib/payments/stripe.ts`** — Captures `subscription_updated` with the new `status` and plan details inside `handleSubscriptionChange`.

| Event name | Description | File |
|---|---|---|
| `sign_up_submitted` | User submitted the signup form on the client side | `components/login.tsx` |
| `sign_in_submitted` | User submitted the sign-in form on the client side | `components/login.tsx` |
| `checkout_initiated` | User clicked Get Started on the pricing page to begin checkout | `pages/pricing.tsx` |
| `account_updated` | User saved changes to their account information on the dashboard | `pages/dashboard/general.tsx` |
| `user_signed_up` | New user account successfully created on the server | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully authenticated on the server | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User session was cleared on the server | `pages/api/auth/sign-out.ts` |
| `checkout_session_created` | Stripe checkout session was successfully created for a user | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe subscription status changed via webhook | `lib/payments/stripe.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member was removed from the team | `pages/api/team/remove-member.ts` |
| `customer_portal_accessed` | User opened the Stripe billing customer portal | `pages/api/stripe/customer-portal.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812629)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/LASs1p56)
- [Signup to checkout funnel (wizard)](https://us.posthog.com/project/483112/insights/zt4fTEI2)
- [Subscription changes (wizard)](https://us.posthog.com/project/483112/insights/dCOg25Cw)
- [Team growth activity (wizard)](https://us.posthog.com/project/483112/insights/0DubqQ69)
- [Checkout initiated vs completed (wizard)](https://us.posthog.com/project/483112/insights/HRSUtNB0)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `_app.tsx` identify only fires when a page passes user data in `pageProps.fallback`; pages without `getServerSideProps` won't hydrate a user and may leave returning sessions on anonymous distinct IDs. Consider fetching `/api/user` client-side on mount as a fallback.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
