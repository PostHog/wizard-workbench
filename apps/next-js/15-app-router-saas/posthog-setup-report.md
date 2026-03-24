<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Next.js 15 App Router SaaS starter. The integration covers both client-side and server-side event tracking, user identification, and a reverse proxy for reliable event delivery.

**What was done:**
- Installed `posthog-js` (client-side) and `posthog-node` (server-side) packages
- Created `instrumentation-client.ts` to initialize PostHog using Next.js 15's built-in client instrumentation hook, with error tracking and a reverse proxy via `/ingest`
- Updated `next.config.ts` with reverse proxy rewrites so PostHog requests route through the app, reducing ad-blocker interference
- Created `lib/posthog-server.ts` as a reusable server-side PostHog client singleton
- Added 12 events across server-side Server Actions and API routes
- Added client-side user identification (`posthog.identify`) in the dashboard layout header, linked to the authenticated user's database ID
- Added `posthog.reset()` on sign-out to cleanly unlink the session

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invited a new member to their team | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from their team | `app/(login)/actions.ts` |
| `checkout_initiated` | User completed a Stripe checkout session | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: a user's subscription was updated | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe webhook: a user's subscription was cancelled | `app/api/stripe/webhook/route.ts` |

## Next steps

Visit your PostHog project to create an **Analytics basics** dashboard with these recommended insights:

- **Signup-to-Checkout Funnel** — Funnel from `user_signed_up` → `checkout_initiated` to measure conversion
- **Daily New Signups** — Trend of `user_signed_up` to track growth
- **Churn Events** — Trend of `account_deleted` and `subscription_cancelled` for retention monitoring
- **Team Engagement** — Trend of `team_member_invited` to track collaboration adoption
- **Auth Activity** — Breakdown of `user_signed_in` and `user_signed_out` over time

Your PostHog project: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
