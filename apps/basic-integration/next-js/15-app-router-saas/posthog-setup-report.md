<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest` to reduce ad-blocker interference. A server-side PostHog client helper was created in `lib/posthog-server.ts` using `posthog-node`. Users are identified via a `PostHogIdentify` client component that reads the current user from SWR and calls `posthog.identify()`. On sign-out, `posthog.reset()` is called to unlink the session. Server-side captures cover all critical business operations: authentication, account management, team management, Stripe checkout completion, and subscription webhook events.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully completed registration and created an account. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully authenticated and started a session. | `app/(login)/actions.ts` |
| `user_signed_out` | A user ended their session by signing out. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their account password. | `app/(login)/actions.ts` |
| `account_deleted` | A user permanently deleted their account. | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email. | `app/(login)/actions.ts` |
| `team_member_removed` | A team owner removed a member from their team. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `app/(login)/actions.ts` |
| `checkout_completed` | A user successfully completed a Stripe checkout and activated a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's Stripe subscription status or plan changed. | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | A team's Stripe subscription was canceled or deleted. | `app/api/stripe/webhook/route.ts` |
| `checkout_started` | A user clicked the Get Started button to begin a plan checkout. | `app/(dashboard)/pricing/submit-button.tsx` |
| `manage_subscription_clicked` | A user clicked the Manage Subscription button to open the billing portal. | `app/(dashboard)/dashboard/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1807682)
- [New signups](https://us.posthog.com/project/483112/insights/ovp0Yfik)
- [Daily active users](https://us.posthog.com/project/483112/insights/JHt8wKd8)
- [Checkout conversion funnel](https://us.posthog.com/project/483112/insights/mWcmZZFl)
- [Subscription cancellations](https://us.posthog.com/project/483112/insights/whKJaRAB)
- [Team growth: invites vs removals](https://us.posthog.com/project/483112/insights/VzORjlZr)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentify` component identifies on every page load when user data is available, so returning sessions are covered; verify this works end-to-end after login and after a page refresh.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
