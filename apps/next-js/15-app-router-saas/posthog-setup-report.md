# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side tracking** using `posthog-node` for backend events
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for better ad-blocker resistance
- **User identification** on both client and server side for correlated analytics
- **Error tracking** with `captureException` for checkout and webhook errors

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully logged into their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `sign_in_failed` | User failed to sign in due to invalid credentials | `app/(login)/actions.ts` |
| `sign_in_form_submitted` | Client-side event when sign-in form is submitted | `app/(login)/login.tsx` |
| `sign_up_form_submitted` | Client-side event when sign-up form is submitted | `app/(login)/login.tsx` |
| `checkout_started` | User initiated a subscription checkout | `lib/payments/stripe.ts` |
| `checkout_completed` | User successfully completed subscription checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | User subscription was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | User subscription was cancelled | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully updated their password | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |
| `team_member_invited` | User invited a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | User removed a team member | `app/(login)/actions.ts` |
| `invitation_accepted` | User accepted an invitation to join a team | `app/(login)/actions.ts` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env` - Environment variables with PostHog configuration

### Modified Files
- `next.config.ts` - Added rewrites for PostHog reverse proxy
- `app/(login)/actions.ts` - Added server-side event tracking
- `app/(login)/login.tsx` - Added client-side event tracking and user identification
- `lib/payments/stripe.ts` - Added checkout started tracking
- `app/api/stripe/checkout/route.ts` - Added checkout completed tracking and error tracking
- `app/api/stripe/webhook/route.ts` - Added subscription event tracking

## Environment Variables

The following environment variables have been configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

To get the most out of your PostHog integration:

1. **View your events** in the PostHog dashboard at https://us.posthog.com
2. **Create custom insights** based on the events implemented:
   - **Sign-up to Checkout Funnel**: Track conversion from `user_signed_up` to `checkout_started` to `checkout_completed`
   - **Authentication Trends**: Monitor `user_signed_in`, `user_signed_out`, and `sign_in_failed` events
   - **Subscription Health**: Track `subscription_updated` and `subscription_cancelled` for churn analysis
   - **Team Engagement**: Monitor `team_member_invited` and `team_member_removed` events
   - **Account Health**: Track `password_updated`, `account_updated`, and `account_deleted` events

3. **Enable Session Replay** in your PostHog project settings to watch user sessions
4. **Set up Feature Flags** to test new features with a subset of users
5. **Configure Alerts** for critical events like high `sign_in_failed` rates or increased `subscription_cancelled` events

## Recommended Dashboard Insights

Create these insights in PostHog for comprehensive analytics:

1. **Sign-up to Purchase Funnel**
   - Events: `user_signed_up` → `checkout_started` → `checkout_completed`

2. **Daily Active Users (Authenticated)**
   - Event: `user_signed_in` (unique users per day)

3. **Churn Indicator**
   - Events: `subscription_cancelled`, `account_deleted`

4. **Authentication Health**
   - Events: `sign_in_failed` vs `user_signed_in` ratio

5. **Team Growth**
   - Events: `team_member_invited`, `invitation_accepted`
