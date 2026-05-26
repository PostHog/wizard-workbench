<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS starter. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), which provides automatic pageview tracking, session replay, and error tracking. A reverse proxy was configured in `next.config.ts` to route PostHog requests through `/ingest`, improving reliability against ad-blockers. A server-side PostHog client (`lib/posthog-server.ts`) using `posthog-node` was created for API route event tracking. Users are identified via `posthog.identify()` on sign-in and sign-up, and `posthog.reset()` is called on sign-out to correctly handle session boundaries.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `user_signed_out` | User clicked the sign-out button | `components/header.tsx` |
| `checkout_started` | User initiated the Stripe checkout flow from pricing | `pages/pricing.tsx` |
| `subscription_manage_clicked` | User opened the Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | User sent a team invitation | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removed a member from the team | `pages/dashboard/index.tsx` |
| `account_updated` | User saved account information changes | `pages/dashboard/general.tsx` |
| `checkout_session_created` | Server created a Stripe checkout session | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe webhook triggered a subscription change | `pages/api/stripe/webhook.ts` |
| `team_invitation_accepted` | A new user signed up via a team invite link | `pages/api/auth/sign-up.ts` |

## Next steps

To see your data in PostHog, create an **"Analytics basics"** dashboard with these recommended insights:

- **[Sign-ups over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_up","type":"events"}]})** — Track new user acquisition as a trend
- **[Sign-in activity](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_in","type":"events"},{"id":"user_signed_up","type":"events"}]})** — Compare sign-in vs sign-up volume
- **[Checkout conversion funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"checkout_started","type":"events","order":0},{"id":"checkout_session_created","type":"events","order":1}]})** — Track how many users who start checkout complete it
- **[Team growth](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"team_member_invited","type":"events"}]})** — Monitor team invitations as a growth signal
- **[Subscription changes](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"subscription_updated","type":"events"}],"breakdown":"subscription_status","breakdown_type":"event"})** — Track subscription status changes broken down by status

You can also [create a new dashboard](https://us.posthog.com/project/2/dashboard/new) and add these insights to it.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
