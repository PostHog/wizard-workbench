<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS app. The integration covers client-side initialization via `instrumentation-client.ts`, a server-side PostHog client in `lib/posthog-server.ts`, a reverse proxy through Next.js rewrites to avoid ad blockers, user identification on login, and server-side event capture for all critical business operations.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired on the server when a new user successfully creates an account. | `app/(login)/actions.ts` |
| `user_signed_in` | Fired on the server when an existing user signs in successfully. | `app/(login)/actions.ts` |
| `user_signed_out` | Fired on the server when a user signs out. | `app/(login)/actions.ts` |
| `invitation_accepted` | Fired on the server when a user accepts a team invitation during sign-up. | `app/(login)/actions.ts` |
| `password_updated` | Fired on the server when a user successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | Fired on the server when a user successfully deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | Fired on the server when a team owner invites a new member by email. | `app/(login)/actions.ts` |
| `team_member_removed` | Fired on the server when a team owner removes a member. | `app/(login)/actions.ts` |
| `checkout_started` | Fired on the server when a user initiates a Stripe checkout session. | `lib/payments/actions.ts` |
| `subscription_checkout_completed` | Fired on the server when a Stripe checkout session completes and the subscription is activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired on the server via Stripe webhook when a subscription status changes. | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Fired on the server via Stripe webhook when a subscription is canceled. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824517)
- **Signups and sign-ins over time**: [TC71QedG](https://us.posthog.com/project/483112/insights/TC71QedG)
- **Checkout conversion funnel**: [O80kFePI](https://us.posthog.com/project/483112/insights/O80kFePI)
- **Subscription churn events**: [pgdZz4xC](https://us.posthog.com/project/483112/insights/pgdZz4xC)
- **Team collaboration activity**: [5rQubkvp](https://us.posthog.com/project/483112/insights/5rQubkvp)
- **User retention after signup**: [KuWX0cCK](https://us.posthog.com/project/483112/insights/KuWX0cCK)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added `posthog.identify()` in the dashboard layout's `UserMenu` component which runs on every authenticated page load, so returning sessions are correctly identified.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
