# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 SaaS application. The integration includes:

- **Client-side initialization** using `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side tracking** with `posthog-node` for API routes and server actions
- **Reverse proxy configuration** in `next.config.ts` to avoid ad blockers
- **User identification** on sign-in and sign-up events
- **Error tracking** with `captureException` for checkout failures
- **Environment variables** configured in `.env` for easy deployment

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user signed up` | User successfully completed account registration | `app/(login)/login.tsx` |
| `user signed in` | User successfully logged into their account | `app/(login)/login.tsx` |
| `user signed out` | User logged out of their account | `app/(login)/actions.ts` |
| `checkout started` | User initiated the checkout process | `lib/payments/actions.ts` |
| `checkout completed` | User successfully completed checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `checkout failed` | Error occurred during checkout process | `app/api/stripe/checkout/route.ts` |
| `account updated` | User updated their account information (name/email) | `app/(login)/actions.ts` |
| `password updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `team member invited` | User sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team member removed` | User removed a member from their team | `app/(login)/actions.ts` |
| `subscription changed` | User's subscription status was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |

## Files Created/Modified

### New Files
- `.env` - PostHog environment variables
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/login.tsx` - Added user identification and sign-in/sign-up tracking
- `app/(login)/actions.ts` - Added server-side events for auth and team actions
- `lib/payments/actions.ts` - Added checkout started event
- `app/api/stripe/checkout/route.ts` - Added checkout completed/failed events and error tracking
- `app/api/stripe/webhook/route.ts` - Added subscription changed event

## Next steps

We recommend creating an "Analytics basics" dashboard in PostHog with the following insights to monitor your SaaS metrics:

### Recommended Insights

1. **Sign-up to Checkout Funnel**
   - Events: `user signed up` → `checkout started` → `checkout completed`
   - Type: Funnel
   - Purpose: Track conversion from registration to paid subscription

2. **User Authentication Trends**
   - Events: `user signed up`, `user signed in`, `user signed out`
   - Type: Trends (daily)
   - Purpose: Monitor daily active users and new registrations

3. **Churn Events**
   - Events: `account deleted`, `subscription changed` (filtered by status=canceled)
   - Type: Trends
   - Purpose: Track user churn and cancellations

4. **Team Collaboration Activity**
   - Events: `team member invited`, `team member removed`
   - Type: Trends
   - Purpose: Monitor team growth and collaboration

5. **Checkout Success Rate**
   - Events: `checkout started`, `checkout completed`, `checkout failed`
   - Type: Funnel
   - Purpose: Monitor payment conversion and identify checkout issues

### Dashboard Links

Create your dashboard at: https://us.posthog.com/project/dashboards/new

### Environment Variables

Make sure your production environment has these variables set:
```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

For more information on PostHog features:
- [PostHog Documentation](https://posthog.com/docs)
- [Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)
- [Creating Funnels](https://posthog.com/docs/product-analytics/funnels)
- [Error Tracking](https://posthog.com/docs/error-tracking)
