# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router 7 application. The integration includes:

- **Client-side SDK initialization** in `entry.client.tsx` with `PostHogProvider` wrapping the application
- **Server-side middleware** (`posthog-middleware.server.ts`) for capturing server-side events with session context
- **Error tracking** via `captureException` in the root error boundary
- **SSR compatibility** with Vite configuration for `posthog-js` and `@posthog/react`
- **Environment variables** configured in `.env` for `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed registration (email or Google OAuth) | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | User successfully logged in (email OTP or Google OAuth) | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | User logged out from the application | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_organization_completed` | User completed organization onboarding step | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | User created a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `checkout_started` | User initiated checkout session for subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_created` | Stripe webhook: new subscription created | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | Stripe webhook: subscription cancelled | `app/features/billing/stripe-event-handlers.server.ts` |
| `checkout_completed` | Stripe webhook: checkout session completed (payment successful) | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | User submitted enterprise contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `invite_link_accepted` | User accepted an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |
| `email_invite_accepted` | User accepted an email invitation to join organization | `app/features/organizations/accept-email-invite/accept-email-invite-action.server.ts` |
| `account_settings_updated` | User updated their account settings (name, avatar) | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Next steps

To get the most out of your PostHog integration, we recommend creating the following insights in your PostHog dashboard:

### Suggested Insights

1. **Signup to Subscription Funnel**: Track conversion from `user_signed_up` → `onboarding_organization_completed` → `checkout_started` → `checkout_completed`
2. **Daily Active Users**: Trend of unique users triggering `user_logged_in` events
3. **Subscription Churn Rate**: Ratio of `subscription_cancelled` to `subscription_created` events
4. **Enterprise Lead Generation**: Count of `contact_sales_submitted` events over time
5. **Team Growth**: Track `invite_link_accepted` and `email_invite_accepted` events to measure viral growth

### Create Your Dashboard

Visit your PostHog project to create these insights:
- [PostHog Dashboard](https://us.i.posthog.com)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Files Modified

- `app/entry.client.tsx` - Added PostHog initialization and PostHogProvider
- `app/root.tsx` - Added PostHog middleware and error boundary capture
- `app/lib/posthog-middleware.server.ts` - New server-side PostHog middleware
- `vite.config.ts` - Added SSR noExternal configuration
- `.env` - Added PostHog environment variables
- Various action files for event tracking (see table above)

## Dependencies Added

- `posthog-js` - Client-side PostHog SDK
- `@posthog/react` - React bindings for PostHog
- `posthog-node` - Server-side PostHog SDK
