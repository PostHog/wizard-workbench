# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router 7 SaaS template. The integration includes:

- **Client-side SDK initialization** with PostHog Provider wrapper in `entry.client.tsx`
- **Server-side middleware** for correlating server events with client sessions via `posthog-middleware.server.ts`
- **Error tracking** in the root error boundary to capture unhandled exceptions
- **User identification** tied to server-side user authentication flow
- **Event tracking** for key business actions across authentication, onboarding, billing, and team management

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_registered` | User successfully completed registration (via email or Google OAuth) | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | User successfully logged in to their account | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_user_account_completed` | User completed the user account onboarding step (name and profile photo) | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | User completed organization onboarding setup | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | User created a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | User clicked to start subscription checkout for a pricing tier | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_changed` | User upgraded, downgraded, or modified their subscription plan | `app/features/billing/billing-action.server.ts` |
| `subscription_cancellation_initiated` | User initiated subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_payment_successful` | User completed payment successfully for subscription | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/billing_.success.tsx` |
| `contact_sales_form_submitted` | User submitted the contact sales form for enterprise pricing | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `team_member_invited` | User invited a team member via email to join their organization | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `organization_deleted` | User deleted their organization (churn indicator) | `app/features/organizations/settings/general/general-organization-settings-action.server.ts` |
| `user_account_deleted` | User deleted their account (churn indicator) | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Files Created/Modified

### New Files
- `app/lib/posthog-middleware.server.ts` - Server-side PostHog middleware for request context
- `.env` - Environment variables with PostHog API key and host

### Modified Files
- `app/entry.client.tsx` - Added PostHog initialization and Provider wrapper
- `app/root.tsx` - Added PostHog middleware and error tracking in ErrorBoundary
- `vite.config.ts` - Added SSR configuration for PostHog packages
- `.env.example` - Added PostHog environment variable templates

## Configuration

Environment variables are configured in `.env`:

```
VITE_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

To get started with your analytics, you can create the following insights in your PostHog dashboard:

### Recommended Insights to Create

1. **Registration to Subscription Funnel**
   - Steps: `user_registered` → `onboarding_user_account_completed` → `onboarding_organization_completed` → `subscription_checkout_started` → `subscription_payment_successful`
   - Track conversion from signup to paid customer

2. **Daily Active Users (Login Trend)**
   - Event: `user_logged_in`
   - Chart type: Line graph over time
   - Track user engagement

3. **Churn Indicators**
   - Events: `subscription_cancellation_initiated`, `organization_deleted`, `user_account_deleted`
   - Chart type: Stacked bar chart
   - Monitor churn signals

4. **Team Growth**
   - Event: `team_member_invited`
   - Chart type: Bar chart with organization breakdown
   - Track viral growth through invitations

5. **Contact Sales Leads**
   - Event: `contact_sales_form_submitted`
   - Chart type: Counter + trend line
   - Monitor enterprise interest

### Access Your Dashboard

Visit your PostHog dashboard to create these insights:
- Dashboard: https://us.i.posthog.com/project

### Documentation

- [PostHog React Documentation](https://posthog.com/docs/libraries/react)
- [PostHog Node.js Documentation](https://posthog.com/docs/libraries/node)
- [Creating Funnels in PostHog](https://posthog.com/docs/product-analytics/funnels)
