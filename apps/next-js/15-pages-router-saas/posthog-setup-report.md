# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The following changes were made:

- Installed `posthog-js` (client-side) and `posthog-node` (server-side) packages
- Created `instrumentation-client.ts` for client-side PostHog initialization using the Next.js 15.3+ approach
- Created `lib/posthog-server.ts` as a singleton server-side PostHog client for API routes
- Configured `next.config.ts` with reverse proxy rewrites to route PostHog ingestion through `/ingest/` to reduce ad-blocker interference
- Added user identification (`posthog.identify()`) on sign-in and sign-up, both server-side and client-side, using the database user ID as the distinct ID
- Added event capture to 9 key user actions across the application

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully completed registration and created a new account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully authenticated and signed in to their account | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signed out of their account | `pages/api/auth/sign-out.ts` |
| `checkout_initiated` | User clicked Get Started on a pricing plan and initiated checkout | `pages/pricing.tsx` |
| `subscription_updated` | Stripe webhook: subscription status changed (upgrade, downgrade, cancellation) | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information (name or email) | `pages/dashboard/general.tsx` |
| `manage_subscription_clicked` | User clicked Manage Subscription to open the Stripe customer portal | `pages/dashboard/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1344803) — Core business metrics: signups, sign-ins, team activity, subscription updates, and subscription conversion funnel

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
