<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) and server-side via a singleton `posthog-node` client in `lib/posthog-server.ts`. A reverse proxy is configured in `next.config.ts` so all analytics traffic routes through `/ingest` to avoid ad blockers. Users are identified client-side in the dashboard layout whenever a session is active, and reset on sign-out. Twelve events covering the full user lifecycle — acquisition, activation, billing, team management, and churn — are captured across both client and server.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired on the server when a user successfully authenticates with email and password. | `app/(login)/actions.ts` |
| `user_signed_up` | Fired on the server when a new user account is successfully created. | `app/(login)/actions.ts` |
| `user_signed_out` | Fired on the server when a user explicitly signs out of their session. | `app/(login)/actions.ts` |
| `password_updated` | Fired on the server when a user successfully changes their password. | `app/(login)/actions.ts` |
| `account_updated` | Fired on the server when a user updates their account information such as name or email. | `app/(login)/actions.ts` |
| `account_deleted` | Fired on the server when a user successfully deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | Fired on the server when a team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | Fired on the server when a team owner removes a member from the team. | `app/(login)/actions.ts` |
| `checkout_started` | Fired on the server when a user initiates a Stripe checkout session for a subscription plan. | `lib/payments/stripe.ts` |
| `checkout_completed` | Fired on the server when a Stripe checkout session completes successfully and the subscription is activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | Fired on the server when a subscription status changes via a Stripe webhook event. | `lib/payments/stripe.ts` |
| `manage_subscription_clicked` | Fired client-side when a user clicks the Manage Subscription button to open the Stripe billing portal. | `app/(dashboard)/dashboard/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1793495)
- [Signup to checkout conversion funnel](https://us.posthog.com/project/483112/insights/MJDhT7ub)
- [New signups over time](https://us.posthog.com/project/483112/insights/QgJvhn6Y)
- [Churn events](https://us.posthog.com/project/483112/insights/vy50KKQV)
- [Sign-ins vs sign-outs](https://us.posthog.com/project/483112/insights/AkS1pnFN)
- [Team member invitations](https://us.posthog.com/project/483112/insights/Rd6Cp4mV)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `useEffect` in `UserMenu` identifies users on every authenticated dashboard load, but verify that sessions persisted via cookie correctly re-identify on return visits.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
