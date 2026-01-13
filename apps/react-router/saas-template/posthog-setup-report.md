# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router 7 SaaS template. The integration includes:

- **Client-side initialization** in `entry.client.tsx` using `PostHogProvider` with automatic page view tracking and session replay
- **Server-side middleware** in `lib/posthog-middleware.server.ts` that creates a PostHog Node client for each request and maintains session/user context between client and server
- **Error tracking** in the root error boundary that automatically captures exceptions
- **User identification** on login and registration flows
- **Event tracking** for key business actions throughout the application

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_registered` | User successfully initiates email or Google registration | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | User successfully initiates email or Google login | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_logged_out` | User logs out of their account | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_user_account_completed` | User completes user account onboarding step | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User completes organization onboarding step | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User creates a new organization | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_checkout_started` | User clicks to start checkout for a subscription plan | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_plan_switch_initiated` | User initiates switching to a different subscription plan | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `contact_sales_form_submitted` | User submits the enterprise contact sales form | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `team_member_invited` | Admin invites a team member via email | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `account_deletion_initiated` | User initiates deletion of their account | `app/features/user-accounts/settings/account/danger-zone.tsx` |

## Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables for PostHog API key and host |
| `app/entry.client.tsx` | Client-side PostHog initialization with PostHogProvider |
| `app/lib/posthog-middleware.server.ts` | Server-side middleware for PostHog Node client |
| `app/root.tsx` | PostHog middleware registration and error boundary tracking |

## Environment Variables

```
VITE_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

We've set up the following for you to keep an eye on user behavior, based on the events we just instrumented:

### Recommended Insights to Create

1. **Registration to Onboarding Funnel**: Track `user_registered` → `onboarding_user_account_completed` → `onboarding_organization_completed` to measure onboarding completion rates

2. **Subscription Conversion Funnel**: Track users from registration through to `subscription_checkout_started` to measure revenue conversion

3. **User Retention**: Monitor `user_logged_in` events over time to track returning users

4. **Team Growth**: Track `organization_created` and `team_member_invited` events to understand collaboration patterns

5. **Churn Indicators**: Monitor `account_deletion_initiated` events to identify potential churn signals

### Additional Recommendations

- Set up **Session Replay** to watch user interactions and identify UX issues
- Create **Feature Flags** to safely roll out new features
- Configure **Surveys** to gather qualitative feedback from users
- Enable **Group Analytics** to track organization-level behavior

Visit your PostHog dashboard at https://us.i.posthog.com to explore your data and create custom insights.
