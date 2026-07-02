<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15.5.7 SaaS starter app. Here's what was set up:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ pattern), with autocapture, session replay, and error tracking enabled.
- **Reverse proxy** rewrites added to `next.config.ts` so all PostHog requests route through `/ingest/` to avoid ad-blockers.
- **Server-side PostHog client** created at `lib/posthog-server.ts` using `posthog-node`, with `flushAt: 1` / `flushInterval: 0` for reliable event delivery in serverless functions.
- **13 server-side events** instrumented across authentication server actions, Stripe checkout, and webhook handlers.
- **User identification** (`posthog.identify`) called on both sign-in and sign-up with the user's numeric database ID as the distinct ID.
- **Error tracking** with `posthog.captureException` added around the Stripe checkout error path.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fires when a user successfully signs in with their email and password. | `app/(login)/actions.ts` |
| `user_signed_up` | Fires when a new user successfully creates an account. | `app/(login)/actions.ts` |
| `user_signed_out` | Fires when a user signs out of their account. | `app/(login)/actions.ts` |
| `account_updated` | Fires when a user updates their account name or email. | `app/(login)/actions.ts` |
| `password_updated` | Fires when a user successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | Fires when a user permanently deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | Fires when a team owner invites a new member via email. | `app/(login)/actions.ts` |
| `team_member_removed` | Fires when a team owner removes an existing member. | `app/(login)/actions.ts` |
| `checkout_started` | Fires when a user initiates a Stripe checkout session from the pricing page. | `lib/payments/actions.ts` |
| `customer_portal_accessed` | Fires when a user opens the Stripe customer billing portal. | `lib/payments/actions.ts` |
| `checkout_completed` | Fires when a user successfully completes a Stripe checkout and their subscription is activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fires when a Stripe webhook reports a subscription status change to active or trialing. | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Fires when a Stripe webhook reports a subscription has been canceled or gone unpaid. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard to keep an eye on user behavior:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/228144/dashboard/1792815)
- **Insight**: [New sign-ups over time](https://us.posthog.com/project/228144/insights/z7JfdvE5)
- **Insight**: [Sign-up to checkout conversion funnel](https://us.posthog.com/project/228144/insights/w9GHX2KS)
- **Insight**: [Active subscriptions vs cancellations](https://us.posthog.com/project/228144/insights/kN6Rz8kG)
- **Insight**: [Team collaboration actions](https://us.posthog.com/project/228144/insights/7GvBZAYQ)
- **Insight**: [Account deletion retention risk](https://us.posthog.com/project/228144/insights/EcDkB61J)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any other bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh sign-in and sign-up; returning sessions that restore from a cookie will remain on anonymous distinct IDs until the user signs in again.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
