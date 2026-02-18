# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageview tracking, session replay, and exception capture
- **Server-side tracking** using `posthog-node` for critical business events (authentication, subscriptions, team management)
- **Reverse proxy configuration** via Next.js rewrites to reduce tracking blocker interference
- **User identification** on both client and server for correlated analytics across the full user journey

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User completed sign-up process successfully | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User signed in successfully | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `pages/api/auth/sign-out.ts` |
| `sign_in_failed` | User sign-in attempt failed | `components/login.tsx` |
| `sign_up_failed` | User sign-up attempt failed | `components/login.tsx` |
| `checkout_initiated` | User clicked Get Started on pricing page | `pages/pricing.tsx` |
| `checkout_completed` | Stripe checkout session completed successfully | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | User subscription was updated via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User subscription was cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner invited a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information | `pages/api/account/update.ts` |
| `invitation_accepted` | User accepted a team invitation during sign-up | `pages/api/auth/sign-up.ts` |
| `customer_portal_opened` | User opened Stripe customer portal | `pages/dashboard/index.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env.local` - Environment variables for PostHog API key and host

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `pages/api/auth/sign-up.ts` - Added user identification and sign-up tracking
- `pages/api/auth/sign-in.ts` - Added user identification and sign-in tracking
- `pages/api/auth/sign-out.ts` - Added sign-out tracking
- `pages/api/stripe/checkout.ts` - Added checkout completion tracking
- `pages/api/stripe/webhook.ts` - Added subscription change tracking
- `pages/api/team/invite.ts` - Added team invitation tracking
- `pages/api/team/remove-member.ts` - Added team member removal tracking
- `pages/api/account/update.ts` - Added account update tracking
- `pages/pricing.tsx` - Added checkout initiation tracking
- `pages/dashboard/index.tsx` - Added customer portal tracking
- `components/login.tsx` - Added client-side auth tracking and user identification

## Next steps

### Recommended Dashboards & Insights

Create the following insights in your PostHog dashboard for comprehensive analytics:

1. **Signup to Checkout Funnel**
   - Steps: `user_signed_up` → `checkout_initiated` → `checkout_completed`
   - Track conversion from new users to paying customers

2. **Subscription Health**
   - Track: `subscription_updated`, `subscription_cancelled`
   - Monitor churn and subscription changes

3. **Team Growth**
   - Track: `team_member_invited`, `invitation_accepted`, `team_member_removed`
   - Measure team expansion and collaboration

4. **Authentication Activity**
   - Track: `user_signed_in`, `user_signed_out`, `sign_in_failed`, `sign_up_failed`
   - Monitor login patterns and authentication issues

5. **User Engagement**
   - Track: `account_updated`, `customer_portal_opened`
   - Measure active user engagement with settings

### Environment Variables

The following environment variables have been configured in `.env.local`:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
