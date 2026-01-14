# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Server-side tracking** via `lib/posthog-server.ts` for API route event capture
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for improved reliability
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- **User identification** on both client and server side during authentication flows
- **Error tracking** with `posthog.captureException()` for catching and reporting errors

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User completed the signup process and created a new account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `pages/api/auth/sign-out.ts` |
| `checkout_started` | User initiated a checkout session to subscribe to a plan | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User successfully completed the Stripe checkout process | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | User's subscription was updated (plan change or status change) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User's subscription was cancelled | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | User invited a new team member via email | `pages/api/team/invite.ts` |
| `team_member_removed` | User removed a team member from their team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account settings (name or email) | `pages/api/account/update.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `pages/pricing.tsx` |
| `sign_in_failed` | User's sign-in attempt failed | `components/login.tsx` |
| `sign_up_failed` | User's sign-up attempt failed | `components/login.tsx` |

## Files Modified/Created

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client helper
- `.env` - Environment variables for PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `components/login.tsx` - Added client-side identify and capture calls
- `pages/api/auth/sign-in.ts` - Added server-side event tracking
- `pages/api/auth/sign-up.ts` - Added server-side event tracking
- `pages/api/auth/sign-out.ts` - Added server-side event tracking
- `pages/api/stripe/create-checkout.ts` - Added checkout started tracking
- `pages/api/stripe/checkout.ts` - Added checkout completed tracking
- `pages/api/stripe/webhook.ts` - Added subscription event tracking
- `pages/api/team/invite.ts` - Added team member invited tracking
- `pages/api/team/remove-member.ts` - Added team member removed tracking
- `pages/api/account/update.ts` - Added account updated tracking
- `pages/pricing.tsx` - Added pricing page viewed tracking

## Next steps

We've instrumented key business events in your application. To get the most value from this integration:

1. **Create a Dashboard**: Go to PostHog and create a new dashboard with the following suggested insights:
   - **Sign-up to Checkout Funnel**: `pricing_page_viewed` → `user_signed_up` → `checkout_started` → `checkout_completed`
   - **Authentication Trends**: Track `user_signed_in`, `user_signed_up`, and `user_signed_out` over time
   - **Subscription Health**: Monitor `subscription_updated` and `subscription_cancelled` events
   - **Team Engagement**: Track `team_member_invited` and `team_member_removed` events
   - **User Retention**: Analyze returning users based on sign-in patterns

2. **View Your Data**: Visit your PostHog dashboard at https://us.posthog.com to see incoming events

3. **Set Up Alerts**: Configure alerts for critical events like `subscription_cancelled` to monitor churn

## Configuration

Environment variables are set in `.env`:
```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The PostHog client is initialized automatically via `instrumentation-client.ts` and events are captured both client-side and server-side for comprehensive analytics coverage.
