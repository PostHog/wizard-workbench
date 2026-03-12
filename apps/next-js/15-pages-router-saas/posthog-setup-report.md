<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. The integration covers client-side initialization via `instrumentation-client.ts`, a shared server-side PostHog client (`lib/posthog-server.ts`), a reverse proxy via Next.js rewrites, user identification on sign-in and sign-up (with distinct ID and session ID forwarded to the server), and event capture across all key business actions including authentication, checkout, subscription management, and team operations.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired server-side when a new user successfully creates an account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Fired server-side when a user successfully signs in | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | Fired client-side when a user signs out; also calls `posthog.reset()` | `components/header.tsx` |
| `checkout_initiated` | Fired client-side when a user submits the checkout form on the pricing page | `pages/pricing.tsx` |
| `subscription_updated` | Fired server-side from Stripe webhook when a subscription is updated | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Fired server-side from Stripe webhook when a subscription is cancelled/deleted | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Fired client-side when a team owner successfully sends a team invitation | `pages/dashboard/index.tsx` |
| `team_member_removed` | Fired client-side when a team member is removed from the team | `pages/dashboard/index.tsx` |
| `account_updated` | Fired client-side when a user successfully updates their account information | `pages/dashboard/general.tsx` |
| `customer_portal_opened` | Fired client-side when a user clicks Manage Subscription | `pages/dashboard/index.tsx` |

## Next steps

To track these events in PostHog, create an "Analytics basics" dashboard with the following insights:

1. **Sign-up funnel** — Funnel from `user_signed_up` → `checkout_initiated` → `subscription_updated` (status: active)
2. **Daily active signups** — Trend of `user_signed_up` over time
3. **Checkout conversion** — Funnel from `checkout_initiated` → `subscription_updated`
4. **Churn rate** — Trend of `subscription_cancelled` over time
5. **Team growth** — Trend of `team_member_invited` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
