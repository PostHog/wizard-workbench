# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router 7 SaaS Template. This integration includes:

- **Client-side SDK initialization** with PostHogProvider in `entry.client.tsx`
- **Server-side middleware** for propagating session/distinct IDs in server actions
- **User identification** via the `PostHogIdentify` component when users are authenticated
- **PostHog reset** on logout to properly handle user sessions
- **Error boundary tracking** via `captureException` in the root error boundary
- **13 custom events** tracked across authentication, billing, organizations, and user lifecycle

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully signs up for an account (registration initiated) | `app/features/user-authentication/registration/register-action.server.ts` |
| `user_logged_in` | User successfully logs into their account | `app/features/user-authentication/login/login-action.server.ts` |
| `user_logged_out` | User logs out of their account | `app/features/organizations/layout/nav-user.tsx` |
| `onboarding_organization_completed` | User completes organization onboarding form | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | User creates a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | User initiates a checkout session for a subscription plan | `app/features/billing/billing-action.server.ts` |
| `subscription_created` | Stripe webhook confirms subscription was successfully created | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_canceled` | User cancels their subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_changed` | User upgrades or downgrades their subscription plan | `app/features/billing/billing-action.server.ts` |
| `invite_link_accepted` | User accepts an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |
| `contact_sales_submitted` | User submits the contact sales form (enterprise lead) | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `user_account_deleted` | User deletes their account | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |
| `checkout_completed` | Stripe webhook confirms checkout session completed successfully | `app/features/billing/stripe-event-handlers.server.ts` |

## Files Created/Modified

### New Files
- `app/lib/posthog-middleware.server.ts` - Server-side PostHog middleware for request context
- `app/lib/posthog-identify.tsx` - Client-side PostHog user identification component
- `.env` - Environment variables for PostHog configuration

### Modified Files
- `app/entry.client.tsx` - Added PostHog initialization and PostHogProvider
- `app/root.tsx` - Added posthogMiddleware and error boundary tracking
- `vite.config.ts` - Added SSR noExternal config for PostHog packages
- `.env.example` - Added PostHog environment variable examples
- Various server action files (see events table above)

## Environment Variables

The following environment variables have been configured in `.env`:

```
VITE_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

We've set up comprehensive event tracking for your SaaS application. You can now:

1. **View your events** in the PostHog dashboard at https://us.i.posthog.com
2. **Create insights** based on the events to track conversion funnels like:
   - Signup → Onboarding completion funnel
   - Checkout started → Checkout completed conversion
   - Subscription lifecycle (created → plan changed → canceled)
3. **Set up alerts** for critical events like `subscription_canceled` or `user_account_deleted`

### Suggested Insights to Create

1. **User Signup Funnel**: `user_signed_up` → `onboarding_organization_completed` → `subscription_checkout_started`
2. **Subscription Conversion**: `subscription_checkout_started` → `checkout_completed` → `subscription_created`
3. **Churn Indicators**: Track `subscription_canceled` and `user_account_deleted` events over time
4. **Enterprise Leads**: Monitor `contact_sales_submitted` events
5. **Team Growth**: Track `invite_link_accepted` events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
