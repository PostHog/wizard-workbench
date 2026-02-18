<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS starter application. The integration covers client-side initialization (via `instrumentation-client.ts`), a server-side PostHog client (`lib/posthog-server.ts`), reverse proxy rewrites for ad-blocker bypass, and 10 tracked business events spanning authentication, team management, and Stripe subscription flows.

**Key changes made:**

- **`instrumentation-client.ts`** *(new)* — Initializes PostHog on the client using the Next.js 15.3+ recommended approach. Enables error tracking (`capture_exceptions: true`) and routes events through the reverse proxy (`/ingest`).
- **`next.config.ts`** — Added PostHog reverse proxy rewrites (`/ingest/*` → PostHog US endpoints) and `skipTrailingSlashRedirect: true` for proper API request handling.
- **`lib/posthog-server.ts`** *(new)* — Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for immediate flushing in serverless contexts.
- **`app/(login)/actions.ts`** — Added `identify()` + server-side events for sign-in, sign-up, sign-out, password update, account deletion, team member invite, and team member removal.
- **`app/api/stripe/checkout/route.ts`** — Added `checkout_started` event when a Stripe checkout session is successfully completed.
- **`app/api/stripe/webhook/route.ts`** — Added `subscription_updated` and `subscription_cancelled` events triggered by Stripe webhook events.
- **`.env.local`** — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_up` | Fired when a new user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out | `app/(login)/actions.ts` |
| `user_password_updated` | Fired when a user successfully updates their password | `app/(login)/actions.ts` |
| `user_account_deleted` | Fired when a user deletes their account | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner invites a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from a team | `app/(login)/actions.ts` |
| `checkout_started` | Fired when a Stripe checkout session is successfully completed | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired when a Stripe subscription is updated via webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Fired when a Stripe subscription is cancelled via webhook | `app/api/stripe/webhook/route.ts` |

## Next steps

To view your analytics, go to your PostHog project and explore the **Events** and **Insights** sections. You can build funnels and trends using the event names above. Recommended insights to create:

- **Signup-to-checkout conversion funnel**: `user_signed_up` → `checkout_started`
- **Authentication trends**: `user_signed_in` + `user_signed_up` over time
- **Churn tracking**: `user_account_deleted` + `subscription_cancelled` over time
- **Team growth**: `team_member_invited` over time

You can access your PostHog project at: **https://us.posthog.com**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
