<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. Here's a summary of all changes made:

## What was set up

- **Client-side analytics** (`posthog-js`): Initialized via `instrumentation-client.ts` with automatic error tracking (`capture_exceptions: true`) and a reverse proxy through `/ingest` to reduce ad-blocker interference.
- **Server-side analytics** (`posthog-node`): A reusable singleton client in `lib/posthog-server.ts` powers all server-side event capture across API routes.
- **User identification**: On successful sign-in/sign-up, users are identified both client-side (`posthog.identify()` in `components/login.tsx`) and server-side (`posthog.identify()` in the respective API handlers), ensuring cross-domain correlation.
- **Error tracking**: `posthog.captureException()` added to key client-side error handlers in the login form, pricing page, and dashboard.
- **Reverse proxy**: `next.config.ts` updated with `/ingest` rewrites pointing to PostHog's ingestion endpoints to bypass tracking blockers.
- **Environment variables**: `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set in `.env.local`.

## Files created

| File | Purpose |
|------|---------|
| `instrumentation-client.ts` | Client-side PostHog initialization (Next.js 15.3+ pattern) |
| `lib/posthog-server.ts` | Server-side PostHog singleton client |

## Events instrumented

| Event Name | Description | File |
|-----------|-------------|------|
| `user_signed_up` | User successfully created a new account | `pages/api/auth/sign-up.ts` |
| `invitation_accepted` | User accepted a team invitation and created their account | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User successfully signed into their account | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signed out of their account | `pages/api/auth/sign-out.ts` |
| `checkout_initiated` | User clicked Get Started on a pricing plan to begin checkout | `pages/pricing.tsx` |
| `checkout_session_created` | Stripe checkout session was created server-side for a user | `pages/api/stripe/create-checkout.ts` |
| `subscription_changed` | Stripe subscription status changed (updated, canceled, etc.) via webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_accessed` | User opened the Stripe customer billing portal to manage their subscription | `pages/api/stripe/customer-portal.ts` |
| `team_invitation_sent` | An invitation was sent to a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was removed from the team | `pages/api/team/remove-member.ts` |
| `account_info_updated` | User saved changes to their account name or email | `pages/dashboard/general.tsx` |
| `subscription_management_clicked` | User clicked the Manage Subscription button to open billing portal | `pages/dashboard/index.tsx` |

## Next steps

Your PostHog project is ready to receive events. Here are some recommended insights to build in PostHog once data starts flowing:

1. **Sign-up conversion funnel** — `checkout_initiated` → `checkout_session_created` → `subscription_changed` (status: active)
2. **Auth funnel** — `user_signed_up` → `user_signed_in` trend over time
3. **Churn signals** — `subscription_changed` filtered to `status = canceled` trend
4. **Team growth** — `team_invitation_sent` and `invitation_accepted` rates
5. **Billing engagement** — `subscription_management_clicked` and `customer_portal_accessed` trends

Visit your PostHog project to start building these insights:
- **PostHog project**: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
