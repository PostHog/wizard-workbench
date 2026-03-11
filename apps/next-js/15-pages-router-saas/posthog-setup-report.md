<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers client-side initialization via `instrumentation-client.ts`, a server-side PostHog Node client, user identification on sign-in and sign-up, 10 custom events spanning the full user lifecycle, and an ingestion reverse proxy via Next.js rewrites.

## Changes summary

| File | What was changed |
|------|-----------------|
| `instrumentation-client.ts` *(new)* | Client-side PostHog init with `/ingest` proxy, `capture_exceptions: true`, and debug mode in development |
| `next.config.ts` | Added PostHog ingestion proxy rewrites and `skipTrailingSlashRedirect: true` |
| `lib/posthog-server.ts` *(new)* | Singleton server-side `PostHog` (posthog-node) client helper |
| `.env.local` | Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` |
| `components/login.tsx` | Added `posthog.identify()` on successful sign-in/sign-up; passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the API to correlate client/server events |
| `components/header.tsx` | Added `user_signed_out` capture and `posthog.reset()` on sign-out |
| `pages/pricing.tsx` | Added `pricing_plan_selected` capture in plan card submit handler; passes PostHog headers to checkout API |
| `pages/dashboard/general.tsx` | Added `account_updated` capture and exception capture on error |
| `pages/api/auth/sign-in.ts` | Added server-side `posthog.identify()` + `user_signed_in` event using headers for client/server ID correlation |
| `pages/api/auth/sign-up.ts` | Added server-side `posthog.identify()` + `user_signed_up` event; aliases client distinct ID to user ID |
| `pages/api/stripe/create-checkout.ts` | Added server-side `checkout_initiated` event |
| `pages/api/stripe/webhook.ts` | Added server-side `subscription_activated` and `subscription_cancelled` events from Stripe webhook |
| `pages/api/team/invite.ts` | Added server-side `team_member_invited` event |
| `pages/api/team/remove-member.ts` | Added server-side `team_member_removed` event |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user account created successfully | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully authenticated | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signed out from the dashboard | `components/header.tsx` |
| `pricing_plan_selected` | User clicks "Get Started" on a pricing plan, initiating checkout | `pages/pricing.tsx` |
| `checkout_initiated` | Stripe checkout session created successfully | `pages/api/stripe/create-checkout.ts` |
| `subscription_activated` | Stripe subscription became active or trialing | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled or became unpaid | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team invitation sent to a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User saved changes to their account information | `pages/dashboard/general.tsx` |

## Next steps

Visit your PostHog project to build insights and a dashboard based on the events we just instrumented. Here are some recommended insights to create:

1. **Signup conversion funnel** — `pricing_plan_selected` → `checkout_initiated` → `subscription_activated`
2. **Daily new signups trend** — `user_signed_up` unique users over time
3. **Churn tracking** — `subscription_cancelled` events over time
4. **Team growth** — `team_member_invited` events grouped by team
5. **Active users** — `user_signed_in` unique users weekly/monthly

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
