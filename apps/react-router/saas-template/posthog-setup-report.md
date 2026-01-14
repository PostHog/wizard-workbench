# PostHog Post-Wizard Report

The wizard has completed a deep integration of PostHog into your React Router SaaS Template project. This integration includes:

- **Client-side initialization** with PostHog JS SDK in `entry.client.tsx`, wrapped with `PostHogProvider` for React hook support
- **Server-side middleware** for event tracking correlation between client and server using `posthog-node`
- **Error boundary tracking** to automatically capture exceptions to PostHog
- **User identification** on login and registration for analytics correlation
- **14 custom events** instrumented across key user journeys

## Environment Variables

PostHog configuration has been added to `.env` and `.env.example`:

| Variable | Description |
|----------|-------------|
| `VITE_PUBLIC_POSTHOG_KEY` | Your PostHog project API key |
| `VITE_PUBLIC_POSTHOG_HOST` | PostHog API host (defaults to `https://us.i.posthog.com`) |

## Events Instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `user_registered` | User submitted the registration form with email or Google | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | User submitted the login form with email or Google | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_logged_out` | User triggered logout action | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_user_account_completed` | User completed the user account onboarding step | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User completed the organization onboarding step | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User created a new organization | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_checkout_started` | User clicked to start a new subscription checkout | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_plan_changed` | User switched to a different subscription plan | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `subscription_cancelled` | User clicked to cancel their subscription | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `contact_sales_form_submitted` | User submitted the contact sales form for enterprise inquiries | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `team_member_invited` | User invited a team member via email | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `invite_link_accepted` | User accepted an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-page.tsx` |
| `user_account_deleted` | User deleted their account from settings | `app/features/user-accounts/settings/account/danger-zone.tsx` |
| `cta_clicked` | User clicked the primary CTA button on the landing page hero | `app/features/landing/hero.tsx` |

## Files Modified/Created

### New Files
- `app/lib/posthog-middleware.server.ts` - Server-side PostHog middleware for request context

### Modified Files
- `app/entry.client.tsx` - Added PostHog initialization and provider
- `app/root.tsx` - Added PostHog middleware and error boundary tracking
- `vite.config.ts` - Added SSR configuration for PostHog packages
- `.env` - Added PostHog environment variables
- `.env.example` - Added PostHog environment variable templates

## Next Steps

### Recommended Dashboard Insights

Create these insights in your PostHog dashboard to track key business metrics:

1. **Registration Funnel**: Track `cta_clicked` → `user_registered` → `onboarding_user_account_completed` → `onboarding_organization_completed`

2. **Subscription Conversion**: Track `subscription_checkout_started` events by tier and interval

3. **Churn Analysis**: Monitor `subscription_cancelled` and `user_account_deleted` events

4. **Team Growth**: Track `team_member_invited` and `invite_link_accepted` events

5. **Enterprise Interest**: Monitor `contact_sales_form_submitted` events

### Additional Configuration

1. **Session Recording**: Enable session replay in your PostHog project settings to see user interactions
2. **Feature Flags**: Use PostHog feature flags for A/B testing and gradual rollouts
3. **Cohorts**: Create user cohorts based on events (e.g., "Active subscribers", "Trial users")

## Links

- [PostHog Dashboard](https://us.i.posthog.com) - Log in to view your analytics
- [PostHog Docs](https://posthog.com/docs) - Official PostHog documentation
- [React Integration Guide](https://posthog.com/docs/libraries/react) - React-specific PostHog documentation
