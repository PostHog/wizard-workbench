<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS application (Pages Router). The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes posthog-js using the Next.js 15.3+ instrumentation pattern. Configures a reverse proxy via `/ingest`, enables exception autocapture, and sets debug mode in development.
- **`next.config.ts`**: Added reverse-proxy rewrites for `/ingest/*`, `/ingest/static/*`, and `/ingest/array/*` paths, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate delivery in serverless/short-lived routes.
- **`components/login.tsx`**: Added `posthog.identify()` on successful sign-in and sign-up. Passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the auth API so client and server events share the same distinct ID.
- **`components/header.tsx`**: Added `posthog.capture('user_signed_out')` and `posthog.reset()` on sign-out.
- **`pages/pricing.tsx`**: Added `posthog.capture('checkout_started')` with plan name, price ID, price, and interval when a user clicks Get Started.
- **`pages/dashboard/index.tsx`**: Added `posthog.capture('customer_portal_opened')` when a user clicks Manage Subscription.
- **`pages/api/auth/sign-in.ts`**: Added server-side `posthog.identify()` and `posthog.capture('user_signed_in')`, using the client's distinct ID from the `X-POSTHOG-DISTINCT-ID` header when present.
- **`pages/api/auth/sign-up.ts`**: Added server-side `posthog.identify()` and `posthog.capture('user_signed_up')` with `via_invite` property, using the client's distinct ID from the `X-POSTHOG-DISTINCT-ID` header when present.
- **`pages/api/stripe/checkout.ts`**: Added `posthog.capture('checkout_completed')` with plan name, subscription ID, and Stripe customer ID after a successful Stripe checkout.
- **`pages/api/stripe/webhook.ts`**: Added `posthog.capture('subscription_updated')` or `posthog.capture('subscription_canceled')` based on Stripe webhook events.
- **`pages/api/team/invite.ts`**: Added `posthog.capture('team_member_invited')` with role and team ID on successful invite.
- **`pages/api/team/remove-member.ts`**: Added `posthog.capture('team_member_removed')` with team ID and member ID on successful removal.
- **`pages/api/account/update.ts`**: Added `posthog.capture('account_updated')` after a successful account info update.

## Events tracked

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired on the server when a new user successfully creates an account. | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Fired on the server when an existing user successfully authenticates. | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | Fired on the client when a user clicks Sign Out from the header menu. | `components/header.tsx` |
| `checkout_started` | Fired on the client when a user clicks Get Started on a pricing plan. | `pages/pricing.tsx` |
| `checkout_completed` | Fired on the server when a Stripe checkout session is successfully processed. | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Fired on the server when a Stripe webhook reports a subscription status change. | `pages/api/stripe/webhook.ts` |
| `subscription_canceled` | Fired on the server when a Stripe webhook reports a subscription cancellation. | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Fired on the server when an owner successfully sends a team invitation. | `pages/api/team/invite.ts` |
| `team_member_removed` | Fired on the server when an owner successfully removes a team member. | `pages/api/team/remove-member.ts` |
| `account_updated` | Fired on the server when a user successfully updates their name or email. | `pages/api/account/update.ts` |
| `customer_portal_opened` | Fired on the client when a user clicks Manage Subscription to open the Stripe customer portal. | `pages/dashboard/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1811336)
- [Signup to paid conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/mEB3ZAhD)
- [New user signups per day (wizard)](https://us.posthog.com/project/483112/insights/aHOrhFjK)
- [Subscription cancellations vs updates (wizard)](https://us.posthog.com/project/483112/insights/7viD8LNr)
- [Team member invites per week (wizard)](https://us.posthog.com/project/483112/insights/m5F6yOYj)
- [Daily active users (sign-ins) (wizard)](https://us.posthog.com/project/483112/insights/ELDYL8rP)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on login/signup; ensure users who return to an already-authenticated session (e.g. page refresh with a valid cookie) also get identified on the client side.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
