<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS starter. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest` for improved reliability. A shared server-side PostHog client in `lib/posthog-server.ts` is used across all API routes and Server Actions. Users are identified with their database ID as the distinct ID, ensuring client and server events are correlated. `posthog.reset()` is called on sign-out to unlink the session.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired on the server when a new user successfully creates an account. | `app/(login)/actions.ts` |
| `user_signed_in` | Fired on the server when an existing user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_out` | Fired on the server when a user signs out of their account. | `app/(login)/actions.ts` |
| `account_updated` | Fired on the server when a user updates their account name or email. | `app/(login)/actions.ts` |
| `password_updated` | Fired on the server when a user successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | Fired on the server when a user deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | Fired on the server when a team owner invites a new member to their team. | `app/(login)/actions.ts` |
| `team_member_removed` | Fired on the server when a team member is removed from a team. | `app/(login)/actions.ts` |
| `subscription_activated` | Fired on the server when a Stripe checkout completes and a subscription is activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired on the server via Stripe webhook when a subscription status changes. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795755)
- [New signups over time](https://us.posthog.com/project/483112/insights/8QrlvwdL)
- [Signup to subscription conversion funnel](https://us.posthog.com/project/483112/insights/KGvMMgMj)
- [Active users: sign-ins vs sign-outs](https://us.posthog.com/project/483112/insights/Z2QYkoQN)
- [Account deletions (churn signal)](https://us.posthog.com/project/483112/insights/yVUJZmIA)
- [Team growth: invitations sent](https://us.posthog.com/project/483112/insights/VIkBZTbA)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `useEffect` in `UserMenu` handles this on every dashboard load, but verify it fires correctly for users who return without re-logging in.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
