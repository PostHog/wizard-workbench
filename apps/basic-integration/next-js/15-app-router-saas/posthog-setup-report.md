<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. The integration covers client-side initialization via `instrumentation-client.ts` (Next.js 15.3+ pattern), a reverse proxy through `/ingest` to avoid ad blockers, server-side event tracking across all critical business flows (auth, payments, team management), and client-side user identification on login and page refresh.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fires when a new user successfully creates an account, with or without an invitation. | `app/(login)/actions.ts` |
| `user_signed_in` | Fires when an existing user successfully authenticates and starts a session. | `app/(login)/actions.ts` |
| `user_signed_out` | Fires when a user ends their session by signing out. | `app/(login)/actions.ts` |
| `checkout_initiated` | Fires when a user clicks to start a Stripe checkout session for a subscription plan. | `lib/payments/actions.ts` |
| `checkout_completed` | Fires when Stripe redirects the user back after a successful subscription checkout. | `app/api/stripe/checkout/route.ts` |
| `subscription_activated` | Fires via Stripe webhook when a subscription becomes active or enters a trial period. | `lib/payments/stripe.ts` |
| `subscription_cancelled` | Fires via Stripe webhook when a subscription is cancelled or becomes unpaid. | `lib/payments/stripe.ts` |
| `team_member_invited` | Fires when a team owner sends an invitation to a new member. | `app/(login)/actions.ts` |
| `team_member_removed` | Fires when a team member is removed from the team. | `app/(login)/actions.ts` |
| `account_updated` | Fires when a user saves changes to their account name or email. | `app/(login)/actions.ts` |
| `password_updated` | Fires when a user successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | Fires when a user confirms and completes account deletion. | `app/(login)/actions.ts` |
| `pricing_page_viewed` | Fires when a user views the pricing page, marking the top of the subscription conversion funnel. | `app/(dashboard)/pricing/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1897443)
- [Signup & conversion funnel](https://us.posthog.com/project/483112/insights/WCBTj35K)
- [Sign-in events over time](https://us.posthog.com/project/483112/insights/EqIj8hfG)
- [Subscription events](https://us.posthog.com/project/483112/insights/Biuz1RMJ)
- [Team growth](https://us.posthog.com/project/483112/insights/QUfJwYxB)
- [Account churn](https://us.posthog.com/project/483112/insights/EgbU3qrp)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
