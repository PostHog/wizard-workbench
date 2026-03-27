<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ pattern) with session replay, error tracking, and reverse proxy support
- **Server-side tracking** using `posthog-node` via a shared `lib/posthog-server.ts` client
- **User identification** on sign-in and sign-up (both client and server side) for cross-domain correlation
- **Reverse proxy rewrites** in `next.config.ts` to route PostHog requests through `/ingest`
- **Error tracking** via `posthog.captureException()` in key client-side error boundaries

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | New user successfully completes registration | `pages/api/auth/sign-up.ts` + `components/login.tsx` |
| `user_signed_in` | User successfully signs in | `pages/api/auth/sign-in.ts` + `components/login.tsx` |
| `user_signed_out` | User signs out | `components/header.tsx` |
| `invitation_accepted` | New user accepts a team invitation | `pages/api/auth/sign-up.ts` |
| `checkout_started` | User clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `subscription_updated` | Stripe subscription is updated (plan change) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription is deleted/cancelled | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner invites a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member is removed | `pages/api/team/remove-member.ts` |
| `account_updated` | User updates their account information | `pages/dashboard/general.tsx` |

## Files Created or Modified

- **Created** `instrumentation-client.ts` — Client-side PostHog initialization
- **Created** `lib/posthog-server.ts` — Server-side PostHog singleton client
- **Modified** `next.config.ts` — Added reverse proxy rewrites for PostHog ingestion
- **Modified** `components/login.tsx` — identify + capture on sign-in/sign-up
- **Modified** `components/header.tsx` — capture + reset on sign-out
- **Modified** `pages/pricing.tsx` — capture checkout_started
- **Modified** `pages/dashboard/general.tsx` — capture account_updated
- **Modified** `pages/api/auth/sign-up.ts` — server-side user_signed_up + invitation_accepted
- **Modified** `pages/api/auth/sign-in.ts` — server-side user_signed_in with identify
- **Modified** `pages/api/team/invite.ts` — server-side team_member_invited
- **Modified** `pages/api/team/remove-member.ts` — server-side team_member_removed
- **Modified** `pages/api/stripe/webhook.ts` — server-side subscription_updated + subscription_cancelled

## Next steps

We recommend building the following insights in PostHog to monitor your key business metrics:

1. **Signup Conversion Funnel** — `checkout_started` → `user_signed_up`: tracks how many users who start checkout end up completing registration
2. **Daily Sign-ups Trend** — trend of `user_signed_up` over time
3. **Subscription Churn** — trend of `subscription_cancelled` to monitor revenue at risk
4. **Team Growth** — `team_member_invited` vs `team_member_removed` to understand team expansion
5. **Authentication Activity** — trend of `user_signed_in` to monitor daily active users

Visit your PostHog project to create these: **https://us.posthog.com/project/238460**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
