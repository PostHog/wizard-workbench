# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS starter. Here's what was set up:

- **Client-side tracking** is initialized via `instrumentation-client.ts` (Next.js 15.3+ pattern), with automatic pageview capture, session replay, and error tracking enabled.
- **Reverse proxy** rewrites were added to `next.config.ts` so PostHog traffic routes through `/ingest/*`, avoiding ad-blocker interference.
- **Server-side tracking** uses a shared `lib/posthog-server.ts` singleton (powered by `posthog-node`) and captures critical business events from Server Actions and API routes.
- **User identification** happens server-side on sign-in and sign-up, linking PostHog's `distinctId` to the database user ID so client and server events are correlated.
- **Environment variables** `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` were written to `.env.local`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account. | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when an existing user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out of their account. | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully changes their password. | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user updates their account name or email. | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user permanently deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner invites a new member by email. | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from the team. | `app/(login)/actions.ts` |
| `checkout_started` | Fired when a user initiates a Stripe subscription checkout. | `lib/payments/actions.ts` |
| `checkout_completed` | Fired when a user successfully completes a subscription checkout. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired when a team subscription status changes via Stripe webhook. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/228144/dashboard/1791942)
- **Insight**: [Signups over time](https://us.posthog.com/project/228144/insights/dZKUCDdy)
- **Insight**: [Signup → Checkout conversion funnel](https://us.posthog.com/project/228144/insights/OsDEk6u4)
- **Insight**: [Active users (sign-ins) over time](https://us.posthog.com/project/228144/insights/Pz1jUbvp)
- **Insight**: [Subscription updates and cancellations](https://us.posthog.com/project/228144/insights/D4NyUwkY)
- **Insight**: [Team growth — invitations and removals](https://us.posthog.com/project/228144/insights/tk73p8by)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
