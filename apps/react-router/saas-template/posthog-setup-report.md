# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router v7 Framework project. The integration includes:

- **Client-side setup**: PostHog is initialized in `entry.client.tsx` with automatic pageview tracking and session recording
- **Server-side tracking**: A PostHog middleware captures server-side events with proper session context propagation
- **Error tracking**: The root `ErrorBoundary` captures exceptions and sends them to PostHog
- **Business event instrumentation**: Key user actions are tracked across authentication, billing, and team management flows

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully registered (email verification sent or OAuth completed) | `app/features/user-authentication/registration/register-action.server.ts` |
| `user_logged_in` | User successfully logged in (email verification sent or OAuth completed) | `app/features/user-authentication/login/login-action.server.ts` |
| `user_logged_out` | User logged out of the application | `app/features/organizations/layout/nav-user.tsx` |
| `onboarding_completed` | User completed the user account onboarding step | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | User created a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | User initiated a subscription checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User initiated subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a cancelled subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switched to a different subscription plan | `app/features/billing/billing-action.server.ts` |
| `checkout_session_completed` | Stripe checkout session completed successfully (server-side webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `team_member_invited` | User invited a team member via email | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `invite_link_accepted` | User accepted an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |
| `contact_sales_submitted` | User submitted the contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |

## Files Modified

- `app/entry.client.tsx` - PostHog initialization and provider wrapper
- `app/root.tsx` - PostHog middleware and error boundary integration
- `app/lib/posthog-middleware.ts` - Server-side PostHog middleware (new file)
- `vite.config.ts` - SSR configuration for PostHog packages
- `.env` - PostHog API key and host configuration

## Next steps

### Recommended Dashboard Insights

Based on the events implemented, we recommend creating the following insights in PostHog:

1. **Signup to Onboarding Funnel**: Track `user_signed_up` → `onboarding_completed` conversion
2. **Free Trial to Paid Conversion**: Track `user_signed_up` → `subscription_checkout_started` → `checkout_session_completed`
3. **Team Growth**: Track `organization_created` → `team_member_invited` → `invite_link_accepted`
4. **Subscription Churn**: Monitor `subscription_cancelled` events and correlate with user properties
5. **Enterprise Lead Generation**: Track `contact_sales_submitted` events

To create these insights:
1. Go to your PostHog dashboard at https://us.i.posthog.com
2. Create a new dashboard named "Analytics basics"
3. Add insights using the event names listed above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
