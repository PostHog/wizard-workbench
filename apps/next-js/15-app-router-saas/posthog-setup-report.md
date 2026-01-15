# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js SaaS application. The integration includes client-side event tracking using `posthog-js` for user interactions and `posthog-node` for server-side capabilities. Events are captured at key conversion points throughout the user journey, from sign-up through subscription management.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization using the recommended Next.js 15.3+ approach
- `lib/posthog-server.ts` - Server-side PostHog client for backend event tracking
- `app/(dashboard)/pricing/pricing-view-tracker.tsx` - Client component for tracking pricing page views

### Files Modified
- `next.config.ts` - Added PostHog reverse proxy rewrites for improved tracking reliability
- `app/(login)/login.tsx` - Added sign-in/sign-up events with user identification
- `app/(dashboard)/layout.tsx` - Added sign-out event tracking with session reset
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout initiation tracking
- `app/(dashboard)/pricing/page.tsx` - Added pricing page view tracker
- `app/(dashboard)/dashboard/page.tsx` - Added subscription management and team member events
- `app/(dashboard)/dashboard/general/page.tsx` - Added account update tracking
- `app/(dashboard)/dashboard/security/page.tsx` - Added password update and account deletion tracking
- `.env` - Added PostHog configuration
- `.env.example` - Added PostHog configuration template

## Events Table

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully created a new account | `app/(login)/login.tsx` |
| `user_signed_in` | User successfully signed into their account | `app/(login)/login.tsx` |
| `user_signed_out` | User signed out of their account | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User initiated checkout process from pricing page | `app/(dashboard)/pricing/submit-button.tsx` |
| `pricing_viewed` | User viewed the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |
| `subscription_managed` | User clicked to manage their subscription via Stripe portal | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_invited` | User invited a new team member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | User removed a team member from the team | `app/(dashboard)/dashboard/page.tsx` |
| `account_updated` | User updated their account information | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_updated` | User successfully updated their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deleted` | User deleted their account (churn event) | `app/(dashboard)/dashboard/security/page.tsx` |

## Next steps

### Recommended Dashboard: "Analytics basics"

Create a dashboard in PostHog with the following insights based on the events instrumented:

1. **Conversion Funnel: Sign-up to Checkout**
   - Steps: `pricing_viewed` → `user_signed_up` → `checkout_started`
   - Purpose: Track conversion from interest to purchase intent

2. **User Authentication Trends**
   - Events: `user_signed_in`, `user_signed_up`, `user_signed_out`
   - Purpose: Monitor daily/weekly active users and sign-up rates

3. **Churn Analysis**
   - Events: `account_deleted`
   - Purpose: Track account deletion rates and identify churn patterns

4. **Team Engagement**
   - Events: `team_member_invited`, `team_member_removed`
   - Purpose: Monitor team growth and collaboration metrics

5. **Settings Engagement**
   - Events: `account_updated`, `password_updated`, `subscription_managed`
   - Purpose: Track user engagement with account management features

### Creating the Dashboard

1. Go to your PostHog project at https://us.i.posthog.com
2. Navigate to Dashboards → New Dashboard
3. Name it "Analytics basics"
4. Add insights using the events listed above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Environment Variables

The following environment variables have been configured:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

These are used by both client-side and server-side PostHog clients.
