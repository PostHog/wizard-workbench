<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` (Next.js 15.3+ pattern) with a reverse proxy through `/ingest` for improved reliability. A server-side singleton client is available via `lib/posthog-server.ts` using `posthog-node`. User identification links client-side anonymous sessions to server-side user IDs via `posthog.identify()` and `posthog.alias()` on both sign-in and sign-up. The `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers are passed with auth API calls to correlate client and server events. Exception capture is enabled globally via `capture_exceptions: true` in the PostHog init, with additional `posthog.captureException()` calls in key error handlers.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to their account | `components/login.tsx` |
| `user_signed_up` | User successfully creates a new account | `components/login.tsx` |
| `checkout_initiated` | User clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `manage_subscription_clicked` | User opens the Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | User successfully invites a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | User successfully removes a team member | `pages/dashboard/index.tsx` |
| `account_updated` | User successfully updates their account info | `pages/dashboard/general.tsx` |
| `sign_in_completed` | Server-side: sign-in API successfully authenticates a user | `pages/api/auth/sign-in.ts` |
| `sign_up_completed` | Server-side: sign-up API successfully creates a new user | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | Server-side: Stripe checkout session created | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Server-side: Stripe subscription status changed | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Server-side: Stripe subscription deleted/cancelled | `pages/api/stripe/webhook.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Signup → Checkout conversion funnel** — Funnel insight with steps: `user_signed_up` → `checkout_initiated` → `checkout_session_created`. Shows where users drop off in the acquisition flow.

2. **Daily signups & sign-ins trend** — Trend insight showing `user_signed_up` and `user_signed_in` event counts over time. Tracks growth and engagement.

3. **Checkout initiation by plan** — Trend insight for `checkout_initiated` broken down by `plan_name` property. Shows which pricing tiers attract the most interest.

4. **Subscription lifecycle** — Trend insight showing `subscription_updated` and `subscription_cancelled` over time. Key churn signal to watch.

5. **Team activity** — Trend insight showing `team_member_invited` and `team_member_removed` counts. Indicates product stickiness and collaborative use.

Create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
