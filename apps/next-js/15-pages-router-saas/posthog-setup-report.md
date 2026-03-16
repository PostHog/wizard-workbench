<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Next.js 15 Pages Router SaaS application. The integration covers client-side initialization, user identification, event tracking for all major conversion and churn flows, server-side analytics for critical API routes, exception capture, and a reverse proxy setup for improved reliability.

## Files created or modified

| File | Change |
|---|---|
| `instrumentation-client.ts` | Created – initializes posthog-js with reverse proxy and error tracking |
| `next.config.ts` | Updated – added `/ingest` reverse proxy rewrites |
| `lib/posthog-server.ts` | Created – server-side PostHog client factory |
| `components/login.tsx` | Updated – identify + capture on sign-in/sign-up; exception capture |
| `components/header.tsx` | Updated – capture sign-out event and reset |
| `pages/pricing.tsx` | Updated – capture checkout initiated event; exception capture |
| `pages/dashboard/index.tsx` | Updated – capture manage subscription, invite, remove member events; exception capture |
| `pages/dashboard/general.tsx` | Updated – capture account settings updated event; exception capture |
| `pages/api/auth/sign-in.ts` | Updated – server-side identify and sign-in event |
| `pages/api/auth/sign-up.ts` | Updated – server-side identify and sign-up event |
| `pages/api/stripe/create-checkout.ts` | Updated – server-side checkout session created event |
| `pages/api/stripe/webhook.ts` | Updated – server-side subscription updated/deleted event |
| `pages/api/team/invite.ts` | Updated – server-side team invitation sent event |

## Events

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `components/login.tsx` |
| `user_signed_up` | New user successfully created an account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_initiated` | User clicked to start a checkout/subscription flow | `pages/pricing.tsx` |
| `team_member_invite_submitted` | Team owner submitted a new member invitation | `pages/dashboard/index.tsx` |
| `team_member_removed` | Team member was removed | `pages/dashboard/index.tsx` |
| `account_settings_updated` | User updated account name or email | `pages/dashboard/general.tsx` |
| `manage_subscription_clicked` | User opened Stripe customer portal | `pages/dashboard/index.tsx` |
| `server_sign_in_succeeded` | Server: user sign-in verified and session created | `pages/api/auth/sign-in.ts` |
| `server_sign_up_succeeded` | Server: new user and team created | `pages/api/auth/sign-up.ts` |
| `server_checkout_session_created` | Server: Stripe checkout session created | `pages/api/stripe/create-checkout.ts` |
| `server_subscription_updated` | Server: subscription updated or cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `server_team_invitation_sent` | Server: team invitation sent | `pages/api/team/invite.ts` |

## Next steps

To build a dashboard from these events, go to PostHog and create a new dashboard called "Analytics basics" with insights like:

- **Sign-up conversion funnel** – steps: `user_signed_up` → `checkout_initiated` → `server_checkout_session_created`
- **Sign-in trend** – trend chart of `user_signed_in` over time
- **Churn signals** – trend chart of `user_signed_out` over time
- **Team growth** – trend chart of `team_member_invite_submitted`
- **Subscription updates** – trend chart of `server_subscription_updated` broken down by `status`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
