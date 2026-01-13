# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 SaaS application. The integration includes:

- **Client-side initialization** using `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side tracking** using `posthog-node` for capturing events in server actions
- **User identification** on both client and server side to correlate user behavior across sessions
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through your domain
- **Environment variables** configured in `.env` for the PostHog API key and host

## Files Created

| File | Purpose |
|------|---------|
| `instrumentation-client.ts` | Client-side PostHog initialization with error tracking enabled |
| `lib/posthog-server.ts` | Server-side PostHog client singleton |
| `app/(dashboard)/pricing/pricing-page-tracker.tsx` | Client component for tracking pricing page views |

## Files Modified

| File | Changes |
|------|---------|
| `next.config.ts` | Added PostHog reverse proxy rewrites and trailing slash configuration |
| `.env` | Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` |
| `app/(login)/actions.ts` | Added server-side event tracking for auth and team management |
| `app/(login)/login.tsx` | Added client-side user identification on form submit |
| `app/(dashboard)/layout.tsx` | Added PostHog reset on sign out |
| `app/(dashboard)/dashboard/page.tsx` | Added manage subscription click tracking |
| `app/(dashboard)/pricing/page.tsx` | Added pricing page tracker component |
| `app/(dashboard)/pricing/submit-button.tsx` | Added subscription plan selection tracking |
| `lib/payments/stripe.ts` | Added checkout started event tracking |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully completes sign-up and creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signs in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiates checkout flow for subscription | `lib/payments/stripe.ts` |
| `subscription_plan_selected` | User clicks to start subscription for a specific pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `team_member_invited` | Owner invites a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Owner removes a team member from the team | `app/(login)/actions.ts` |
| `account_updated` | User updates their account information (name, email) | `app/(login)/actions.ts` |
| `password_updated` | User successfully updates their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (churn event) | `app/(login)/actions.ts` |
| `manage_subscription_clicked` | User clicks to manage their subscription via customer portal | `app/(dashboard)/dashboard/page.tsx` |
| `pricing_page_viewed` | User views pricing page (top of conversion funnel) | `app/(dashboard)/pricing/pricing-page-tracker.tsx` |

## Next steps

We recommend creating the following insights and a dashboard in PostHog to monitor your key business metrics:

### Suggested Insights to Create

1. **Sign-up to Checkout Funnel**
   - Events: `user_signed_up` → `pricing_page_viewed` → `subscription_plan_selected` → `checkout_started`
   - Type: Funnel
   - Purpose: Track conversion from sign-up to paid subscription

2. **User Retention**
   - Events: `user_signed_in`
   - Type: Retention
   - Purpose: Track how often users return to sign in

3. **Churn Analysis**
   - Events: `account_deleted`
   - Type: Trends
   - Purpose: Monitor account deletions over time

4. **Team Growth**
   - Events: `team_member_invited`, `team_member_removed`
   - Type: Trends
   - Purpose: Track team expansion and contraction

5. **Subscription Management**
   - Events: `manage_subscription_clicked`, `checkout_started`
   - Type: Trends
   - Purpose: Monitor subscription-related user actions

### Create Your Dashboard

Visit your PostHog project to create these insights:
- **PostHog Dashboard**: https://us.i.posthog.com/project/insights

### Environment Variables

The following environment variables have been configured:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Running the Application

Start your development server to begin capturing events:

```bash
pnpm dev
```

Events will be captured automatically as users interact with your application.
