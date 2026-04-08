<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The following changes were made:

- **`instrumentation-client.ts`** (new) — Client-side PostHog initialization using the Next.js 15.3+ instrumentation API. Initializes `posthog-js` with the reverse proxy host, exception capture, and debug mode in development.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog client using `posthog-node` for use in API routes and webhooks.
- **`next.config.ts`** (updated) — Added reverse proxy rewrites for `/ingest/*` and `/ingest/static/*` to route PostHog requests through the Next.js server, avoiding ad blockers. Added `skipTrailingSlashRedirect: true`.
- **`.env.local`** (updated) — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`components/login.tsx`** (updated) — Added `posthog.identify()` and `user_signed_in` / `user_signed_up` capture after successful authentication. Added `posthog.captureException()` on unexpected errors.
- **`components/header.tsx`** (updated) — Added `user_signed_out` capture and `posthog.reset()` in the sign-out handler.
- **`pages/pricing.tsx`** (updated) — Added `checkout_initiated` capture with plan name, price, and interval. Added `posthog.captureException()` on checkout errors.
- **`pages/api/auth/sign-in.ts`** (updated) — Added server-side `posthog.identify()` and `user_signed_in` capture after successful authentication.
- **`pages/api/auth/sign-up.ts`** (updated) — Added server-side `posthog.identify()` and `user_signed_up` capture after successful registration.
- **`pages/api/team/invite.ts`** (updated) — Added server-side `team_member_invited` capture with invited email, role, and team ID.
- **`pages/api/team/remove-member.ts`** (updated) — Added server-side `team_member_removed` capture with member and team IDs.
- **`pages/api/stripe/webhook.ts`** (updated) — Added server-side `subscription_updated` and `subscription_cancelled` captures on Stripe webhook events.
- **`pages/api/stripe/create-checkout.ts`** (updated) — Added server-side `checkout_session_created` capture when a Stripe checkout session is created for an authenticated user.
- **`pages/api/account/update.ts`** (updated) — Added server-side `posthog.identify()` (to update person properties) and `account_updated` capture when a user updates their name/email.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | Fired client-side after successful sign-in. Calls `posthog.identify()`. | `components/login.tsx` |
| `user_signed_up` | Fired client-side after successful sign-up. Calls `posthog.identify()`. | `components/login.tsx` |
| `user_signed_out` | Fired client-side on sign-out. Calls `posthog.reset()`. | `components/header.tsx` |
| `checkout_initiated` | Fired client-side when a user clicks "Get Started" on a pricing plan. | `pages/pricing.tsx` |
| `user_signed_in` | Server-side event + identify after successful authentication. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Server-side event + identify after new account creation. | `pages/api/auth/sign-up.ts` |
| `team_member_invited` | Fired when a team owner invites a new member. | `pages/api/team/invite.ts` |
| `team_member_removed` | Fired when a team member is removed. | `pages/api/team/remove-member.ts` |
| `subscription_updated` | Fired via Stripe webhook on subscription plan change. | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Fired via Stripe webhook on subscription cancellation. | `pages/api/stripe/webhook.ts` |
| `checkout_session_created` | Fired when a Stripe checkout session is created for an authenticated user. | `pages/api/stripe/create-checkout.ts` |
| `account_updated` | Fired when a user updates their account name or email. | `pages/api/account/update.ts` |

## Next steps

We recommend building an "Analytics basics" dashboard in PostHog with the following insights:

1. **Sign-up & Sign-in Trends** — Trends chart for `user_signed_up` and `user_signed_in` over time to track growth and engagement.
2. **Checkout Conversion Funnel** — Funnel: `checkout_initiated` → `checkout_session_created` → `subscription_updated` to measure conversion rate from pricing page to active subscription.
3. **Subscription Churn** — Trends chart for `subscription_cancelled` over time to monitor churn.
4. **Team Growth** — Trends chart for `team_member_invited` and `team_member_removed` to track collaboration adoption.
5. **Active Users** — Unique users who fired `user_signed_in` in the last 30 days.

Create these at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
