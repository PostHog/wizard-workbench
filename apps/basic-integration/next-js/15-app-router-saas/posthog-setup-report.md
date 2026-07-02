<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. Server-side event tracking was added to all critical business flows — authentication, Stripe payments, and team management — using `posthog-node`. Client-side session replay and error tracking are initialised via `instrumentation-client.ts`. A reverse proxy routes all PostHog traffic through `/ingest` to improve ad-blocker resilience and data accuracy.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates with email and password. | `app/(login)/actions.ts` |
| `user_signed_up` | User creates a new account (with optional team invitation). | `app/(login)/actions.ts` |
| `user_signed_out` | User ends their session by signing out. | `app/(login)/actions.ts` |
| `checkout_started` | User initiates a Stripe checkout session for a subscription plan. | `lib/payments/actions.ts` |
| `checkout_completed` | Stripe checkout session completes and subscription is activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook confirms a subscription status change (active or trialing). | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe webhook confirms a subscription was cancelled or became unpaid. | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes an existing member from the team. | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deletes their account. | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their account password. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792929)
- [New sign-ups over time](https://us.posthog.com/project/483112/insights/rG8anN3u)
- [Signup to checkout conversion funnel](https://us.posthog.com/project/483112/insights/AUMtcoum)
- [Subscription events over time](https://us.posthog.com/project/483112/insights/exXMYu1Z)
- [Account deletions (churn)](https://us.posthog.com/project/483112/insights/sKACSIaw)
- [Team member invites](https://us.posthog.com/project/483112/insights/JcbweQUU)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh sign-in/sign-up. If you want returning sessions to be identified server-side on page load, add an identify call in the session verification path in `lib/auth/session.ts`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
