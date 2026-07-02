# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Client-side tracking is initialised via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) with a reverse proxy configured in `next.config.ts`. A singleton server-side PostHog client was added at `lib/posthog-server.ts` using `posthog-node`. User identification runs client-side in the dashboard layout whenever authenticated user data loads, and is also performed server-side on sign-in and sign-up. Sign-out captures a final event and resets the PostHog session. Critical business events — checkout, subscription lifecycle, and team management — are captured both client-side and server-side.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account. | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when an existing user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user clicks the sign-out button in the header. | `app/(dashboard)/layout.tsx` |
| `checkout_started` | Fired when a user clicks the Get Started button on a pricing plan. | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | Fired on the server when a Stripe checkout session is successfully processed. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired on the server when a Stripe subscription is updated via webhook. | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Fired on the server when a Stripe subscription is cancelled via webhook. | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from the team. | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user successfully updates their account name or email. | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user successfully deletes their account. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792477)
- [Signup conversion funnel](https://us.posthog.com/project/483112/insights/754dFDdo)
- [Churn: subscription_cancelled](https://us.posthog.com/project/483112/insights/1QOHuT2t)
- [Active users: user_signed_in](https://us.posthog.com/project/483112/insights/5kJK89xw)
- [Team growth: team_member_invited](https://us.posthog.com/project/483112/insights/oINis9u0)
- [Account deletion churn: account_deleted](https://us.posthog.com/project/483112/insights/y4CKDBh0)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
