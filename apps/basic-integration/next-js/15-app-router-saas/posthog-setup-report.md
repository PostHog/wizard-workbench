<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. The integration covers client-side initialization via `instrumentation-client.ts`, a reverse proxy through Next.js rewrites, server-side event tracking in all critical server actions and API routes using `posthog-node`, client-side user identification with `posthog.identify()` on every dashboard load (covering both first-login and returning-session paths), and `posthog.reset()` on sign-out. Error tracking is enabled automatically via `capture_exceptions: true` in the client init.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully signed in. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `checkout_initiated` | A user clicked Get Started to begin the Stripe checkout flow. | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | A user successfully completed Stripe checkout and activated a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription changed to active or trialing via a Stripe webhook. | `lib/payments/stripe.ts` |
| `subscription_canceled` | A team's subscription was canceled or became unpaid via a Stripe webhook. | `lib/payments/stripe.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from a team. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their account password. | `app/(login)/actions.ts` |
| `account_deleted` | A user permanently deleted their account. | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email address. | `app/(login)/actions.ts` |
| `customer_portal_opened` | A user clicked Manage Subscription to open the Stripe customer portal. | `app/(dashboard)/dashboard/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1818192)
- [User Signups & Sign-ins](https://us.posthog.com/project/483112/insights/SVXdWdiD)
- [Checkout conversion funnel](https://us.posthog.com/project/483112/insights/olx0UZyD)
- [Subscription events](https://us.posthog.com/project/483112/insights/d94PKK8h)
- [Account management activity](https://us.posthog.com/project/483112/insights/0AIerACQ)
- [Team collaboration](https://us.posthog.com/project/483112/insights/azZ4RHqW)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added it in `app/(dashboard)/layout.tsx`'s `UserMenu` component so it fires on every dashboard load, covering both fresh logins and returning sessions.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
