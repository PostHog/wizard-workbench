<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers:

- **Client-side initialization** via `instrumentation-client.ts` using `posthog-js`, with a reverse proxy through `/ingest` for ad-blocker resilience and error tracking enabled.
- **Server-side tracking** via a shared `lib/posthog-server.ts` singleton using `posthog-node`, used in all API route handlers.
- **User identification** on both client (login/signup success) and server (sign-in and sign-up API handlers) using the user's email as the distinct ID.
- **Conversion funnel events**: signup → sign-in → checkout initiated → checkout completed.
- **Churn signals**: subscription cancelled via Stripe webhook.
- **Team lifecycle events**: member invited and removed.
- **Error capture** with `posthog.captureException()` in client-side catch blocks.

### Files created
- `instrumentation-client.ts` — PostHog client-side initialization
- `lib/posthog-server.ts` — Server-side PostHog singleton
- `.env.local` — PostHog environment variables (gitignored)

### Files modified
- `next.config.ts` — Added PostHog reverse proxy rewrites
- `components/login.tsx` — identify + sign-in/sign-up capture + captureException
- `pages/api/auth/sign-in.ts` — Server-side user_signed_in + identify
- `pages/api/auth/sign-up.ts` — Server-side user_signed_up + identify
- `pages/pricing.tsx` — checkout_initiated capture + captureException
- `pages/api/stripe/checkout.ts` — checkout_completed capture
- `pages/api/stripe/webhook.ts` — subscription_updated + subscription_cancelled capture
- `pages/api/team/invite.ts` — team_member_invited capture
- `pages/api/team/remove-member.ts` — team_member_removed capture
- `pages/dashboard/general.tsx` — account_updated capture + captureException

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `checkout_initiated` | User clicked Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_completed` | User completed Stripe checkout, subscription created | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Stripe subscription updated via webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription cancelled via webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Owner invited a new member to their team | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member was removed from a team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated account information | `pages/dashboard/general.tsx` |

## Next steps

To view your analytics data, visit your PostHog project and create an "Analytics basics" dashboard with these recommended insights:

- **Signup trend** — Trend chart for `user_signed_up` over time
- **Sign-in trend** — Trend chart for `user_signed_in` over time
- **Conversion funnel** — Funnel: `user_signed_up` → `checkout_initiated` → `checkout_completed`
- **Subscription cancellations** — Trend chart for `subscription_cancelled`
- **Team growth** — Trend chart for `team_member_invited`

Visit your PostHog project: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
