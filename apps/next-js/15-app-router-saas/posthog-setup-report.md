<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS project. Here's what was done:

- **Installed** `posthog-js` (client-side) and `posthog-node` (server-side) packages
- **Created** `instrumentation-client.ts` — initializes PostHog on the client using the recommended Next.js 15.3+ approach, with session replay, error tracking, and debug mode in development
- **Updated** `next.config.ts` — added reverse proxy rewrites for PostHog ingestion (`/ingest/*`) and `skipTrailingSlashRedirect: true`
- **Created** `lib/posthog-server.ts` — singleton server-side PostHog client using `posthog-node`
- **Set** environment variables in `.env.local` — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- **Instrumented** 6 files with 12 events covering the full user lifecycle, conversion funnel, and churn signals

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/(login)/login.tsx`, `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed into an existing account | `app/(login)/login.tsx`, `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_initiated` | User clicked the checkout/subscribe button on the pricing page | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completed a Stripe checkout session | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A subscription was updated or cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information (name or email) | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `customer_portal_opened` | User opened the Stripe customer portal to manage subscription | `app/(dashboard)/dashboard/page.tsx` |

## Next steps

To build an "Analytics basics" dashboard in PostHog, navigate to your [PostHog project](https://us.posthog.com/project/2) and create a new dashboard with these recommended insights:

1. **Signup & signin trend** — Trends chart with `user_signed_up` and `user_signed_in` over time
2. **Checkout conversion funnel** — Funnel: `checkout_initiated` → `checkout_completed`
3. **Full acquisition funnel** — Funnel: `user_signed_up` → `checkout_initiated` → `checkout_completed`
4. **Churn events** — Trends chart with `account_deleted` and `subscription_updated` (filtered to `subscription_status = canceled`) over time
5. **Team growth** — Trends chart with `team_member_invited` and `team_member_removed` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
