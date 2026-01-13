# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js Pages Router SaaS project with PostHog. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageview tracking and error capture
- **Server-side tracking** via `lib/posthog-server.ts` for backend event capture
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for improved reliability
- **User identification** on sign-in and sign-up to link anonymous and authenticated sessions
- **Error tracking** with `posthog.captureException()` in all catch blocks
- **Session reset** on sign-out via `posthog.reset()` for proper user separation

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully creates a new account | `components/login.tsx` |
| `user_signed_in` | User successfully signs in to their account | `components/login.tsx` |
| `user_signed_out` | User signs out of their account | `components/header.tsx` |
| `pricing_page_viewed` | User views the pricing page (top of conversion funnel) | `pages/pricing.tsx` |
| `checkout_initiated` | User initiates checkout for a subscription plan | `pages/pricing.tsx` |
| `checkout_completed` | User completes checkout and subscription is activated | `pages/api/stripe/checkout.ts` |
| `account_updated` | User updates their account information (name/email) | `pages/dashboard/general.tsx` |
| `team_member_invited` | User invites a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removes a team member from the team | `pages/dashboard/index.tsx` |
| `subscription_managed` | User clicks to manage their subscription via Stripe portal | `pages/dashboard/index.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env` - Environment variables for PostHog API key and host

### Modified Files
- `next.config.ts` - Added rewrites for PostHog reverse proxy
- `components/login.tsx` - Added user identification and sign-in/sign-up events
- `components/header.tsx` - Added sign-out event and session reset
- `pages/pricing.tsx` - Added pricing page view and checkout initiated events
- `pages/api/stripe/checkout.ts` - Added server-side checkout completed event
- `pages/dashboard/general.tsx` - Added account updated event
- `pages/dashboard/index.tsx` - Added team member invited/removed and subscription managed events

## Environment Variables

The following environment variables have been configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

Create insights and a dashboard in PostHog to monitor user behavior. Recommended insights based on the implemented events:

1. **Sign-up to Checkout Funnel** - Track conversion from `user_signed_up` → `pricing_page_viewed` → `checkout_initiated` → `checkout_completed`

2. **User Authentication Trends** - Monitor `user_signed_in`, `user_signed_up`, and `user_signed_out` events over time

3. **Subscription Conversion Rate** - Calculate the percentage of users who complete checkout after viewing pricing

4. **Team Collaboration Metrics** - Track `team_member_invited` and `team_member_removed` events to understand team growth

5. **Account Engagement** - Monitor `account_updated` and `subscription_managed` to track user engagement with account settings

### PostHog Dashboard

Visit your PostHog project to create these insights:
- [PostHog US](https://us.posthog.com)

### Useful Links

- [PostHog Documentation](https://posthog.com/docs)
- [Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)
- [Creating Funnels](https://posthog.com/docs/product-analytics/funnels)
- [User Identification](https://posthog.com/docs/product-analytics/identify)
