<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended Next.js 15.3+ approach), with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. A singleton server-side client (`lib/posthog-server.ts`) powers event capture in Server Actions and API routes via `posthog-node`. Users are identified on both the client (via a `useEffect` in the dashboard layout's `UserMenu`) and the server (on sign-in, sign-up, and account updates). `posthog.reset()` is called on sign-out to unlink the session.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully creates an account. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signs out of their account. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully updates their password. | `app/(login)/actions.ts` |
| `account_updated` | A user successfully updates their account information. | `app/(login)/actions.ts` |
| `account_deleted` | A user deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner invites a new member to their team. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member is removed from the team. | `app/(login)/actions.ts` |
| `checkout_initiated` | A user starts the Stripe checkout flow to subscribe to a plan. | `lib/payments/actions.ts` |
| `subscription_started` | A user successfully completes checkout and starts a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A user's subscription is updated via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | A user's subscription is cancelled via Stripe webhook. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812177)
- [Signups & sign-ins over time](https://us.posthog.com/project/483112/insights/qP1eTL5b)
- [Signup to subscription funnel](https://us.posthog.com/project/483112/insights/nHGL5Zut)
- [Subscription lifecycle](https://us.posthog.com/project/483112/insights/oSIwMai2)
- [Churn signals](https://us.posthog.com/project/483112/insights/CsaJxqsm)
- [Team collaboration activity](https://us.posthog.com/project/483112/insights/ZnEDt7si)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
