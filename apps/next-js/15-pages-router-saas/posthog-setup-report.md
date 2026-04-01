<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS project.

## What was set up

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ pattern) with session replay, error tracking, and a reverse proxy through `/ingest`
- **Reverse proxy rewrites** added to `next.config.ts` to route PostHog traffic through the app (avoids ad blockers)
- **Server-side PostHog client** at `lib/posthog-server.ts` using `posthog-node` for API route tracking
- **Environment variables** written to `.env.local` (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`)
- **User identification** on sign-in and sign-up via `posthog.identify()` with email as the distinct ID
- **Session reset** on sign-out via `posthog.reset()`
- **Error tracking** via `posthog.captureException()` in client-side error boundaries

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in | `components/login.tsx` |
| `user_signed_up` | User creates a new account | `components/login.tsx` |
| `user_signed_out` | User clicks sign out | `components/header.tsx` |
| `checkout_initiated` | User clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `checkout_session_created` | Stripe checkout session created (server-side) | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Subscription updated via Stripe webhook (server-side) | `pages/api/stripe/webhook.ts` |
| `subscription_canceled` | Subscription canceled via Stripe webhook (server-side) | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team member invitation sent (server-side) | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member removed (server-side) | `pages/api/team/remove-member.ts` |
| `account_updated` | User saves account information changes | `pages/dashboard/general.tsx` |
| `customer_portal_opened` | Stripe customer portal session created (server-side) | `pages/api/stripe/customer-portal.ts` |

## Next steps

To build your "Analytics basics" dashboard in PostHog, navigate to your project and create a new dashboard with these recommended insights:

1. **Signup-to-checkout conversion funnel** — Funnel from `user_signed_up` → `checkout_initiated` → `checkout_session_created`
2. **Active users trend** — Trend of `user_signed_in` over time (daily/weekly)
3. **Subscription cancellation rate** — Trend of `subscription_canceled` vs `subscription_updated`
4. **Team growth** — Trend of `team_member_invited` and `team_member_removed` over time
5. **Account engagement** — Trend of `account_updated` to measure dashboard engagement

Visit your PostHog project at https://us.posthog.com/project/238460 to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
