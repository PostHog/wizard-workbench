# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 SaaS application. The integration includes both client-side and server-side event tracking, user identification, error tracking, and a reverse proxy setup for improved reliability.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization using the recommended Next.js 15.3+ approach
- `lib/posthog-server.ts` - Server-side PostHog client for backend event tracking
- `app/(dashboard)/pricing/pricing-tracker.tsx` - Client component for tracking pricing page views
- `.env` - Environment variables with PostHog configuration

### Files Modified
- `next.config.ts` - Added PostHog reverse proxy rewrites for `/ingest` endpoint
- `app/(login)/actions.ts` - Added server-side tracking for auth events (sign up, sign in, sign out, password updates, account updates, account deletion, team invites, team member removal)
- `app/(login)/login.tsx` - Added client-side user identification on login/signup form submission
- `lib/payments/actions.ts` - Added tracking for checkout and subscription portal events
- `app/api/stripe/checkout/route.ts` - Added tracking for subscription creation and checkout errors
- `app/(dashboard)/pricing/page.tsx` - Added pricing page view tracking
- `.env.example` - Added PostHog environment variable documentation

## Events Tracked

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | Fires when a new user successfully creates an account | `app/(login)/actions.ts`, `app/(login)/login.tsx` |
| `user_signed_in` | Fires when a user successfully signs in to their account | `app/(login)/actions.ts`, `app/(login)/login.tsx` |
| `user_signed_out` | Fires when a user signs out of their account | `app/(login)/actions.ts` |
| `password_updated` | Fires when a user successfully changes their password | `app/(login)/actions.ts` |
| `account_updated` | Fires when a user updates their account information (name/email) | `app/(login)/actions.ts` |
| `account_deleted` | Fires when a user deletes their account (churn event) | `app/(login)/actions.ts` |
| `team_member_invited` | Fires when a team owner invites a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Fires when a team member is removed from the team | `app/(login)/actions.ts` |
| `invitation_accepted` | Fires when a user accepts a team invitation during sign up | `app/(login)/actions.ts` |
| `pricing_page_viewed` | Fires when user views the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/pricing-tracker.tsx` |
| `checkout_started` | Fires when user clicks to start checkout for a pricing plan | `lib/payments/actions.ts` |
| `subscription_created` | Fires when checkout completes and subscription is created | `app/api/stripe/checkout/route.ts` |
| `subscription_portal_opened` | Fires when user opens the Stripe customer portal to manage subscription | `lib/payments/actions.ts` |
| `checkout_error` | Fires when an error occurs during checkout processing | `app/api/stripe/checkout/route.ts` |

## Key Features

### User Identification
- Users are identified by their email address as the distinct ID
- Client-side identification happens on form submission (before server action)
- Server-side identification includes additional properties like role, name, and subscription status

### Error Tracking
- Automatic exception capture enabled via `capture_exceptions: true`
- Checkout errors are explicitly captured with error details

### Reverse Proxy
- PostHog requests are proxied through `/ingest` to avoid ad blockers
- Static assets proxied from `https://us-assets.i.posthog.com`
- API requests proxied to `https://us.i.posthog.com`

## Next steps

We recommend building insights and a dashboard to track user behavior based on the events instrumented:

### Suggested Insights to Create

1. **Signup to Subscription Funnel**
   - Steps: `user_signed_up` → `pricing_page_viewed` → `checkout_started` → `subscription_created`
   - Track conversion rates through the purchase funnel

2. **Daily Active Users**
   - Track unique users by `user_signed_in` events over time

3. **Churn Analysis**
   - Monitor `account_deleted` events
   - Compare with subscription status and tenure

4. **Team Growth**
   - Track `team_member_invited` and `invitation_accepted` events
   - Measure team expansion rate

5. **Subscription Management**
   - Monitor `subscription_portal_opened` events
   - Early warning for potential churn

### PostHog Dashboard

Visit your PostHog project to create these insights:
- [PostHog Dashboard](https://us.posthog.com)

### Environment Variables

Make sure the following environment variables are set:
```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
