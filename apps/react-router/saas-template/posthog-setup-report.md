# PostHog Post-Wizard Report

The wizard has completed a deep integration of PostHog into your React Router 7 SaaS template. This integration includes:

- **Client-side initialization** in `entry.client.tsx` with PostHogProvider wrapper
- **Server-side middleware** for tracking headers and server-side events
- **Automatic pageview tracking** via PostHog's built-in functionality
- **Error boundary integration** to capture exceptions automatically
- **User identification** on login and signup
- **Business-critical event tracking** across authentication, billing, onboarding, and organization management flows

## Events Tracked

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `login_form_submitted` | User submits login form with email or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `signup_form_submitted` | User submits registration form with email or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `logout_clicked` | User clicks to log out of the application | `app/features/organizations/layout/nav-user.tsx` |
| `onboarding_user_account_completed` | User completes user account onboarding step | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User completes organization onboarding step | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User creates a new organization | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_checkout_started` | User opens checkout session to subscribe to a plan | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_plan_changed` | User upgrades or downgrades their subscription plan | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `subscription_cancellation_initiated` | User initiates subscription cancellation | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `team_member_invited` | User invites a team member by email | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `email_invite_accepted` | User accepts an email invitation to join an organization | `app/features/organizations/accept-email-invite/accept-email-invite-page.tsx` |
| `contact_sales_form_submitted` | User submits contact sales form for enterprise inquiry | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `user_account_deleted` | User deletes their account | `app/features/user-accounts/settings/account/danger-zone.tsx` |
| `stripe_checkout_completed` | Server-side: Stripe checkout session completed webhook | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `stripe_subscription_created` | Server-side: Stripe subscription created webhook | `app/routes/api+/v1+/stripe.webhooks.ts` |

## Files Modified

### Core Integration
- `app/entry.client.tsx` - PostHog client initialization with PostHogProvider
- `app/root.tsx` - Added PostHog middleware and error boundary exception capture
- `app/lib/posthog-middleware.server.ts` - Server-side PostHog middleware (new file)
- `vite.config.ts` - Added SSR noExternal for PostHog packages
- `.env` - Added PostHog environment variables

### Event Tracking
- `app/routes/_user-authentication+/_anonymous-routes+/login.tsx`
- `app/routes/_user-authentication+/_anonymous-routes+/register.tsx`
- `app/routes/_authenticated-routes+/onboarding+/user-account.tsx`
- `app/routes/_authenticated-routes+/onboarding+/organization.tsx`
- `app/features/organizations/layout/nav-user.tsx`
- `app/features/organizations/create-organization/create-organization-form-card.tsx`
- `app/features/billing/create-subscription-modal-content.tsx`
- `app/features/billing/cancel-or-modify-subscription-modal-content.tsx`
- `app/features/billing/contact-sales/contact-sales-team.tsx`
- `app/features/organizations/settings/team-members/invite-by-email-card.tsx`
- `app/features/organizations/accept-email-invite/accept-email-invite-page.tsx`
- `app/features/user-accounts/settings/account/danger-zone.tsx`
- `app/routes/api+/v1+/stripe.webhooks.ts`

## Next Steps

Once you have real user data flowing through your application, you can create insights and dashboards in PostHog to track:

1. **Signup to Subscription Funnel** - Track conversion from signup through subscription checkout
2. **Onboarding Completion Rate** - Monitor how many users complete the full onboarding flow
3. **Subscription Changes** - Track upgrades, downgrades, and cancellations
4. **Team Growth** - Monitor organization growth through team invitations
5. **Churn Analysis** - Analyze user account deletions and subscription cancellations

### Recommended Dashboards

Create these dashboards in your PostHog project:
- **User Acquisition** - Track signups, login methods, and invite acceptance
- **Onboarding** - Monitor onboarding funnel completion
- **Revenue** - Track subscription events and billing changes
- **Retention** - Monitor logout, cancellation, and deletion events

### Agent Skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure to set these environment variables in your production environment:

```env
VITE_PUBLIC_POSTHOG_KEY=your_posthog_api_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
