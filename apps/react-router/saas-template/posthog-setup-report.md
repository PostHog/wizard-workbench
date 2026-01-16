# PostHog Post-Wizard Report

The wizard has completed a deep integration of PostHog into your React Router 7 Framework application. This integration includes:

- **Client-side SDK initialization** in `entry.client.tsx` with the PostHogProvider wrapper
- **Server-side middleware** for capturing events with user/session context correlation
- **Error boundary integration** for automatic exception capture
- **Event tracking** across 13 key business events including user authentication, billing, and organization management

## Configuration

Environment variables have been configured in `.env`:
- `VITE_PUBLIC_POSTHOG_KEY` - Your PostHog project API key
- `VITE_PUBLIC_POSTHOG_HOST` - PostHog host URL (https://us.i.posthog.com)

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed registration (email OTP or Google OAuth) | `app/features/user-authentication/registration/register-action.server.ts` |
| `user_logged_in` | User successfully logged in | `app/features/user-authentication/login/login-action.server.ts` |
| `user_logged_out` | User logged out of the application | `app/routes/_user-authentication+/logout.ts` |
| `organization_created` | User created a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `invite_link_accepted` | User accepted an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |
| `contact_sales_submitted` | User submitted the contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `checkout_completed` | Stripe checkout session completed successfully | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_created` | New subscription was created via Stripe webhook | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | Subscription was cancelled (churn event) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_updated` | Subscription was modified | `app/features/billing/stripe-event-handlers.server.ts` |
| `user_account_updated` | User updated their account settings | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |
| `user_account_deleted` | User deleted their account (churn event) | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |
| `onboarding_user_completed` | User completed the user onboarding step | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |

## Files Modified/Created

### New Files
- `app/lib/posthog-middleware.server.ts` - Server-side PostHog middleware for session/user context

### Modified Files
- `app/entry.client.tsx` - PostHog client initialization and provider wrapper
- `app/root.tsx` - Error boundary with exception capture, middleware registration
- `vite.config.ts` - SSR configuration for PostHog packages
- `app/utils/env.server.ts` - PostHog environment variable schema
- `.env` - PostHog environment variables
- `.env.example` - PostHog environment variable templates

## Next Steps

### Create Your Dashboard

To get the most out of your PostHog integration, create a dashboard in PostHog with the following suggested insights:

1. **Signup to Checkout Funnel** - Track conversion from `user_signed_up` → `checkout_completed`
2. **User Retention** - Monitor `user_logged_in` events over time
3. **Churn Analysis** - Track `subscription_cancelled` and `user_account_deleted` events
4. **Organization Growth** - Monitor `organization_created` and `invite_link_accepted` events
5. **Revenue Events** - Track `checkout_completed` with amount properties

Visit your [PostHog Dashboard](https://us.i.posthog.com) to create insights based on these events.

### Recommended Funnel Insights

1. **Signup Funnel**: `user_signed_up` → `onboarding_user_completed` → `organization_created`
2. **Conversion Funnel**: `user_signed_up` → `checkout_completed`
3. **Engagement Funnel**: `user_logged_in` → `organization_created` → `invite_link_accepted`

### Agent Skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Technical Details

### Client-Side Tracking
- Uses `posthog-js` and `@posthog/react` packages
- Initialized with tracing headers for server correlation
- Available via `usePostHog()` hook in any component

### Server-Side Tracking
- Uses `posthog-node` package
- Middleware extracts session/distinct IDs from headers
- Events are automatically correlated with client sessions
- Proper shutdown handling for each request

### Error Tracking
- Automatic exception capture in the root ErrorBoundary
- Uses `posthog.captureException()` for error reporting
