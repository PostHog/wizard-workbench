<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. The integration covers client-side initialization, server-side event capture, user identification on both client and server, and a reverse proxy setup for improved data reliability and ad-blocker resistance.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using the Next.js 15.3+ instrumentation pattern, with exception tracking enabled and a reverse proxy via `/ingest`
- `lib/posthog-server.ts` — Singleton server-side PostHog client (posthog-node) for capturing events from API routes and Server Actions
- `.env.local` — PostHog public key and host environment variables

**Files modified:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites for PostHog and `skipTrailingSlashRedirect: true`
- `app/(login)/actions.ts` — Added server-side captures for authentication and account management events
- `app/(login)/login.tsx` — Added client-side `posthog.identify()` call on form submit
- `app/api/stripe/checkout/route.ts` — Added `subscription_activated` capture on successful checkout
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` and `subscription_cancelled` captures on Stripe webhook events

**Packages installed:** `posthog-js@1.360.0`, `posthog-node@5.28.0`

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when a user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out | `app/(login)/actions.ts` |
| `invitation_accepted` | Fired when a user accepts an invitation to join a team during sign-up | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully changes their password | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user updates their account information (name, email) | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user deletes their account (churn signal) | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner invites a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed | `app/(login)/actions.ts` |
| `subscription_activated` | Fired when a user successfully completes checkout and a subscription is created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired when a Stripe subscription is updated via webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Fired when a Stripe subscription is deleted/cancelled via webhook | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built a dashboard with insights to track user behavior based on the events just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1344803)
  - [User Acquisition](https://us.posthog.com/project/2/insights/pfv4PACB) — daily sign-ups and sign-ins
  - [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/Cpg2izVb) — pricing → checkout → completion funnel
  - [Subscription Activity](https://us.posthog.com/project/2/insights/etSY0JLy) — subscription changes over time
  - [Team Collaboration Activity](https://us.posthog.com/project/2/insights/vkhSOnDI) — member invitations and removals
  - [Churn Signals](https://us.posthog.com/project/2/insights/a1wKlBlE) — account deletions over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
