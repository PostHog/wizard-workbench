<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using PostHog JS with error tracking and a reverse proxy
- **Server-side tracking** via a shared `lib/posthog-server.ts` singleton using `posthog-node`
- **Reverse proxy** configured in `next.config.ts` to route PostHog ingestion through `/ingest` for improved reliability and ad-blocker bypass
- **User identification** on both client-side (after successful login/signup in `components/login.tsx`) and server-side (in `pages/api/auth/sign-in.ts` and `pages/api/auth/sign-up.ts`) to correlate frontend and backend behavior
- **Exception tracking** via `posthog.captureException()` in error catch blocks on the client side
- **9 custom events** covering the full user lifecycle from signup through subscription management

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in to their account | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_up` | User successfully creates a new account | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `checkout_initiated` | User clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `subscription_created` | User subscription successfully created after checkout | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | User subscription plan or status changed via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User subscription cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner invites a new member to join the team | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removes a member from the team | `pages/api/team/remove-member.ts` |
| `account_settings_updated` | User updates their account name or email in general settings | `pages/dashboard/general.tsx` |

## Next steps

Visit your [PostHog project](https://us.posthog.com/project/2) to start viewing your analytics data. Suggested insights to build:

- **Signup to Subscription Funnel**: `user_signed_up` → `checkout_initiated` → `subscription_created`
- **Churn Rate**: Count of `subscription_cancelled` events over time
- **Team Growth**: Trend of `team_member_invited` events
- **Active Users**: Unique users triggering `user_signed_in` per day/week
- **Account Engagement**: `account_settings_updated` as a retention signal

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
