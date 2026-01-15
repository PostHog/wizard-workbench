# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router v7 Framework project. The integration includes:

- **Client-side SDK initialization** with PostHogProvider wrapping your application in `entry.client.tsx`
- **Server-side middleware** for tracking and context in `lib/posthog-middleware.ts`
- **Error tracking** in the root ErrorBoundary component
- **15 custom events** instrumented across critical user flows including authentication, onboarding, billing, and team collaboration

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `login_with_email_submitted` | User submits login form with email/magic link | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `login_with_google_clicked` | User clicks Google OAuth login button | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `registration_with_email_submitted` | User submits registration form with email | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `registration_with_google_clicked` | User clicks Google OAuth registration button | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `onboarding_user_account_completed` | User completes user account onboarding step | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User completes organization onboarding step | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User creates a new organization | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_checkout_started` | User initiates checkout for a subscription plan | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_plan_changed` | User upgrades or downgrades subscription plan | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `subscription_cancellation_clicked` | User clicks to cancel their subscription | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `contact_sales_submitted` | User submits contact sales form for enterprise | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `paste_created` | User creates a new paste | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `invite_link_accepted` | User accepts an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-page.tsx` |
| `email_invite_accepted` | User accepts an email organization invite | `app/features/organizations/accept-email-invite/accept-email-invite-page.tsx` |
| `account_deleted` | User deletes their account (churn event) | `app/features/user-accounts/settings/account/danger-zone.tsx` |

## Configuration

Environment variables have been added to your `.env` file:
- `VITE_PUBLIC_POSTHOG_KEY` - Your PostHog API key
- `VITE_PUBLIC_POSTHOG_HOST` - Your PostHog host URL

## Next steps

Create insights and a dashboard in PostHog to monitor user behavior. Recommended insights:

1. **Registration to Onboarding Funnel**: Track conversion from `registration_with_email_submitted` or `registration_with_google_clicked` -> `onboarding_user_account_completed` -> `onboarding_organization_completed`

2. **Subscription Conversion Funnel**: Track `subscription_checkout_started` -> successful subscription events

3. **Churn Analysis**: Monitor `subscription_cancellation_clicked` and `account_deleted` events

4. **Team Growth**: Track `organization_created`, `invite_link_accepted`, and `email_invite_accepted`

5. **Product Engagement**: Monitor `paste_created` events to track feature adoption

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.
