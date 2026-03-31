<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Client-side PostHog initialization using Next.js 15.3+ instrumentation. Initializes `posthog-js` with the reverse proxy host (`/ingest`), error tracking (`capture_exceptions`), and debug mode in development.
- **`next.config.ts`** — Added reverse-proxy rewrites so PostHog traffic routes through `/ingest/*` and `/ingest/static/*`, avoiding ad blockers. Added `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for reliable server-side event delivery.
- **`.env.local`** — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`components/login.tsx`** — Added `posthog.identify()` and `posthog.capture()` on successful sign-in/sign-up, and `posthog.captureException()` on errors.
- **`components/header.tsx`** — Added `posthog.capture('user_signed_out')` and `posthog.reset()` when user signs out.
- **`pages/pricing.tsx`** — Added `posthog.capture('checkout_initiated')` when a pricing plan is selected, with `captureException` on checkout errors.
- **`pages/dashboard/general.tsx`** — Added `posthog.capture('account_updated')` on successful account settings save.
- **`pages/api/auth/sign-in.ts`** — Server-side: `posthog.identify()` + `posthog.capture('user_signed_in')` on successful authentication.
- **`pages/api/auth/sign-up.ts`** — Server-side: `posthog.identify()` + `posthog.capture('user_signed_up')` on successful registration.
- **`pages/api/stripe/create-checkout.ts`** — Server-side: `posthog.capture('checkout_session_created')` after Stripe checkout session is created.
- **`pages/api/stripe/webhook.ts`** — Server-side: `posthog.capture('subscription_updated')` and `posthog.capture('subscription_cancelled')` based on Stripe webhook events.
- **`pages/api/team/invite.ts`** — Server-side: `posthog.capture('team_member_invited')` after invitation is inserted.
- **`pages/api/team/remove-member.ts`** — Server-side: `posthog.capture('team_member_removed')` after member deletion.

## Events tracked

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in (client-side) | `components/login.tsx` |
| `user_signed_up` | User successfully signs up (client-side) | `components/login.tsx` |
| `user_signed_out` | User signs out | `components/header.tsx` |
| `checkout_initiated` | User clicks "Get Started" on a pricing plan | `pages/pricing.tsx` |
| `account_updated` | User saves account settings successfully | `pages/dashboard/general.tsx` |
| `user_signed_in` | Server-side sign-in event with identify | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Server-side sign-up event with identify | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | Stripe checkout session created | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe subscription updated (webhook) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription cancelled (webhook) | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team member invitation sent | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member removed | `pages/api/team/remove-member.ts` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with these recommended insights:

1. **Signup funnel** — Funnel: `checkout_initiated` → `checkout_session_created` → `subscription_updated`
2. **New signups over time** — Trend: `user_signed_up` (unique users)
3. **Daily active sign-ins** — Trend: `user_signed_in` (unique users)
4. **Subscription cancellations** — Trend: `subscription_cancelled`
5. **Team growth** — Trend: `team_member_invited` vs `team_member_removed`

Visit your PostHog project to create the dashboard:
- **Project dashboard list**: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
