# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ approach)
- **Server-side tracking** using `posthog-node` for API routes and server actions
- **Reverse proxy configuration** in `next.config.ts` to avoid ad blockers
- **User identification** on sign-in and sign-up events
- **Comprehensive event tracking** across authentication, payments, and team management flows
- **Error tracking** for checkout failures

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully creates a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully logs into their account | `app/(login)/actions.ts` |
| `user_signed_out` | User logs out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiates the checkout process for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completes checkout and subscribes to a plan | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changes (upgrade, downgrade, or cancel) | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully updates their password | `app/(login)/actions.ts` |
| `account_updated` | User updates their account information (name or email) | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (churn event) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invites a new member to join the team | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member from the team | `app/(login)/actions.ts` |
| `pricing_page_viewed` | User views the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - PostHog client-side initialization
- `lib/posthog-server.ts` - Server-side PostHog client helper
- `app/(dashboard)/pricing/pricing-tracker.tsx` - Client component for pricing page tracking
- `.env` - Environment variables with PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/actions.ts` - Added user identification and event tracking
- `lib/payments/actions.ts` - Added checkout_started event
- `app/api/stripe/checkout/route.ts` - Added checkout_completed event and error tracking
- `app/api/stripe/webhook/route.ts` - Added subscription_updated event
- `app/(dashboard)/pricing/page.tsx` - Added pricing page view tracking
- `.env.example` - Added PostHog environment variable documentation

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/dashboard/1104700)
- **Insights**:
  - [User Authentication Activity](https://us.posthog.com/project/insights/8x0pJuGj) - Daily signups and logins over time
  - [User Profile Activity](https://us.posthog.com/project/insights/CUIPWGi9) - Profile updates, password changes, and account management
  - [Subscription Activity](https://us.posthog.com/project/insights/tUyKbSAY) - Checkout, plan swaps, and billing portal visits
  - [Account Churn Tracking](https://us.posthog.com/project/insights/8sGvLPfb) - Account deletion events to monitor user churn
  - [Signup to Checkout Funnel](https://us.posthog.com/project/insights/9Da35D8d) - Conversion funnel from sign-up to checkout

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
