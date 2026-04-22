<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was already substantially instrumented in this codebase. The wizard verified and extended the integration with the following changes:

- **Environment variables**: Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`.
- **Reverse proxy** (`next.config.ts`): Added the missing `/ingest/array/:path*` rewrite rule so PostHog array assets route correctly through the proxy to `us-assets.i.posthog.com`.
- **Pricing page** (`app/(dashboard)/pricing/`): Created a `PricingPageTracker` client component that captures `pricing_viewed` when the pricing page loads — the entry point to the conversion funnel.
- **Client-side init** (`instrumentation-client.ts`): Already in place with `capture_exceptions: true`, reverse proxy, and debug mode.
- **Server-side client** (`lib/posthog-server.ts`): Already in place and used across all server actions and API routes.

| Event | Description | File |
|---|---|---|
| `pricing_viewed` | User viewed the pricing page — top of the conversion funnel | `app/(dashboard)/pricing/pricing-tracker.tsx` |
| `checkout_initiated` | User started the checkout process for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed checkout and subscribed to a plan | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | User's subscription details were updated | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | User's subscription was canceled or became unpaid | `app/api/stripe/webhook/route.ts` |
| `customer_portal_opened` | User opened the Stripe customer billing portal | `lib/payments/actions.ts` |
| `user_signed_up` | New user registered an account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `invitation_accepted` | User signed up via team invitation link | `app/(login)/actions.ts` |
| `team_member_invited` | A new member was invited to join the team | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deleted their account | `app/(login)/actions.ts` |

## Next steps

To build an "Analytics basics" dashboard in PostHog, navigate to your PostHog project and create the following insights:

1. **Conversion funnel** — Steps: `pricing_viewed` → `checkout_initiated` → `checkout_completed`
2. **Signups over time** — Trend of `user_signed_up` events
3. **Active subscriptions** — Trend of `checkout_completed` events
4. **Churn rate** — Trend of `subscription_canceled` events
5. **Team growth** — Trend of `team_member_invited` and `invitation_accepted` events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
