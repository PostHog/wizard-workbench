# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router 7 SaaS template. The integration includes:

- **Client-side initialization** via `posthog-js` and `@posthog/react` in `entry.client.tsx`, wrapped with `PostHogProvider`
- **Server-side middleware** using `posthog-node` for server-side tracking capabilities
- **Error boundary integration** to automatically capture exceptions to PostHog
- **Environment configuration** using Vite's `VITE_PUBLIC_*` prefix for client-side access
- **SSR compatibility** with `noExternal` configuration in Vite for PostHog packages

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User completes registration with email or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | User successfully logs in with email or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `onboarding_user_account_completed` | User completes the user account onboarding step | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User completes organization creation during onboarding | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User creates a new organization after initial onboarding | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_checkout_started` | User initiates checkout for a subscription plan | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_plan_changed` | User upgrades, downgrades, or switches billing interval | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `subscription_cancelled` | User cancels their subscription | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `contact_sales_submitted` | User submits enterprise sales contact form | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `team_member_invited` | Admin invites a team member by email | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `invite_link_accepted` | User accepts an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-page.tsx` |
| `pricing_page_viewed` | User views the public pricing page (top of conversion funnel) | `app/routes/pricing.tsx` |

## Files Modified

- `app/entry.client.tsx` - PostHog client initialization and PostHogProvider wrapper
- `app/root.tsx` - Added PostHog middleware and error boundary exception capture
- `app/lib/posthog-middleware.server.ts` - New server-side PostHog middleware
- `vite.config.ts` - Added SSR noExternal configuration for PostHog packages
- `.env` - Added PostHog environment variables

## Next steps

### Create your dashboard

To get the most out of your PostHog integration, create a dashboard in PostHog with insights based on these events:

1. **Signup to Subscription Funnel** - Track conversion from `user_signed_up` → `onboarding_user_account_completed` → `onboarding_organization_completed` → `subscription_checkout_started`

2. **User Acquisition Trends** - Track `user_signed_up` over time, broken down by `method` (email vs google)

3. **Subscription Metrics** - Monitor `subscription_checkout_started`, `subscription_plan_changed`, and `subscription_cancelled` events

4. **Team Growth** - Track `team_member_invited` and `invite_link_accepted` to understand viral growth

5. **Enterprise Interest** - Monitor `contact_sales_submitted` to gauge enterprise demand

### Recommended insights to create:

- **Conversion Funnel**: `pricing_page_viewed` → `user_signed_up` → `subscription_checkout_started`
- **Churn Analysis**: Track `subscription_cancelled` with breakdown by `tier` and `interval`
- **Onboarding Completion Rate**: `user_signed_up` → `onboarding_organization_completed`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Environment Variables

Make sure these environment variables are set in your production environment:

```
VITE_PUBLIC_POSTHOG_KEY=your_posthog_api_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
