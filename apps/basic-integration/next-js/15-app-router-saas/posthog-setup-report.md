# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS project. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) and server-side via `lib/posthog-server.ts` using `posthog-node`. A reverse proxy is configured in `next.config.ts` so all PostHog traffic routes through `/ingest` on your own domain, improving reliability and ad-blocker resilience. Environment variables are stored in `.env.local`. Error tracking (`capture_exceptions`) is enabled in the client init.

User identification (`posthog.identify`) is called with the user's email as the distinct ID on both sign-in and sign-up, correlating client-side and server-side events for the same user.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User submits the sign-in form with their credentials. | `app/(login)/login.tsx` |
| `user_signed_up` | User submits the sign-up form to create a new account. | `app/(login)/login.tsx` |
| `checkout_started` | User initiates a Stripe checkout session for a subscription plan. | `lib/payments/stripe.ts` |
| `checkout_completed` | User successfully completes a Stripe checkout and activates their subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_status_changed` | A team's subscription status changes (updated or canceled) via Stripe webhook. | `lib/payments/stripe.ts` |
| `password_updated` | User successfully changes their account password. | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deletes their account. | `app/(login)/actions.ts` |
| `account_updated` | User updates their account name or email. | `app/(login)/actions.ts` |
| `team_member_invited` | User sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | User removes an existing member from their team. | `app/(login)/actions.ts` |
| `subscription_management_opened` | User clicks the Manage Subscription button to open the Stripe customer portal. | `app/(dashboard)/dashboard/page.tsx` |
| `pricing_plan_selected` | User clicks Get Started to begin checkout for a pricing plan. | `app/(dashboard)/pricing/submit-button.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/228144/dashboard/1792456)
- [Signups & Logins](https://us.posthog.com/project/228144/insights/b7aekhdd)
- [Signup to Checkout Conversion Funnel](https://us.posthog.com/project/228144/insights/1B0K5pCw)
- [Subscription Completions](https://us.posthog.com/project/228144/insights/7nChobGf)
- [Account Deletions / Churn](https://us.posthog.com/project/228144/insights/9wOi1ZKJ)
- [Team Growth — Invitations Sent](https://us.posthog.com/project/228144/insights/amvRQSDu)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `posthog.identify` is called only on sign-in/sign-up form submit; a returning user who is already logged in (session restored from cookie) will be on an anonymous distinct ID until they sign in again. Consider calling `identify` in a client component that reads the current session on app load.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
