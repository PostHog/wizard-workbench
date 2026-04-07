<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers client-side initialization, server-side event tracking, user identification across both domains, and exception capture for critical user flows.

**New files created:**
- `instrumentation-client.ts` — Initializes `posthog-js` on the client using the Next.js instrumentation hook. Enables session replay, exception capture, and routes events through the `/ingest` reverse proxy.
- `lib/posthog-server.ts` — Singleton `posthog-node` client for server-side event capture from API routes.
- `.env.local` — PostHog public token and host added.

**Existing files modified:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites for PostHog (improves ad-blocker bypass and data accuracy).
- `components/login.tsx` — Identify users and capture `sign_in`/`sign_up` on successful auth. Passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the server so client/server events are correlated. Error tracking via `captureException`.
- `components/header.tsx` — Captures `sign_out` and calls `posthog.reset()` to clear the identity on logout.
- `pages/pricing.tsx` — Captures `checkout_initiated` when a user clicks "Get Started" on a pricing plan.
- `pages/dashboard/general.tsx` — Captures `account_updated` when a user saves account info. Error tracking on failure.
- `pages/api/auth/sign-in.ts` — Server-side `server_sign_in` event + `identify()` using user email as distinct ID. Links anonymous client session via `$anon_distinct_id`.
- `pages/api/auth/sign-up.ts` — Server-side `server_sign_up` event + `identify()`. Tracks whether signup came via team invitation.
- `pages/api/stripe/webhook.ts` — Captures `subscription_updated` and `subscription_cancelled` from Stripe webhooks using the Stripe customer ID as the distinct ID.
- `pages/api/team/invite.ts` — Captures `team_member_invited` with the invited email and role.

## Events

| Event | Description | File |
|-------|-------------|------|
| `sign_up` | User successfully signs up | `components/login.tsx` |
| `sign_in` | User successfully signs in | `components/login.tsx` |
| `sign_out` | User signs out | `components/header.tsx` |
| `checkout_initiated` | User clicks Get Started on pricing | `pages/pricing.tsx` |
| `subscription_updated` | Stripe subscription updated (renewal, plan change) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription cancelled | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | User invites a team member | `pages/api/team/invite.ts` |
| `account_updated` | User updates their account info | `pages/dashboard/general.tsx` |
| `server_sign_in` | Server-side: user authentication verified | `pages/api/auth/sign-in.ts` |
| `server_sign_up` | Server-side: new user account created | `pages/api/auth/sign-up.ts` |

## Next steps

To build an "Analytics basics" dashboard in PostHog with these events, go to your PostHog project and create the following insights:

1. **Signup → Checkout funnel** — Funnel insight with steps: `sign_up` → `checkout_initiated` → `subscription_updated`. This reveals your conversion rate from registration to paid subscription.

2. **Sign-ups over time** — Trends insight showing `sign_up` count per day/week. Your top-of-funnel growth metric.

3. **Subscription cancellations** — Trends insight showing `subscription_cancelled` count over time. Your churn signal.

4. **Team invitations** — Trends insight showing `team_member_invited` count. A proxy for product engagement and virality.

5. **Active users** — Trends insight showing unique users (unique person count) firing any event per week.

You can create these at: **https://us.posthog.com/project/2/insights/new**

And create the dashboard at: **https://us.posthog.com/project/2/dashboards/new**

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
