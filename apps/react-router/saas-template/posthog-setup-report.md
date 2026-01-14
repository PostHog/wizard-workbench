# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router 7 SaaS template application. The integration includes:

- **Client-side initialization** in `app/entry.client.tsx` with the PostHog provider wrapping your application
- **Server-side middleware** in `app/lib/posthog-middleware.ts` that creates a PostHog Node client for each request and passes session/distinct IDs from client to server
- **Error tracking** in the root error boundary (`app/root.tsx`) using `posthog.captureException()`
- **User identification** on login and registration forms
- **Event tracking** across key business actions including authentication, onboarding, billing, and team management

## Environment Variables

PostHog is configured via these environment variables in `.env`:

```
VITE_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_registered` | User completes registration form (email or Google OAuth) | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | User successfully logs in (email or Google OAuth) | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `onboarding_user_account_completed` | User completes user account onboarding step | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User completes organization onboarding step | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User creates a new organization | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_checkout_started` | User initiates subscription checkout for a pricing plan | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_plan_changed` | User upgrades, downgrades, or modifies their subscription plan | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `subscription_cancelled` | User cancels their subscription | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `subscription_payment_successful` | User completes subscription payment successfully | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/billing_.success.tsx` |
| `contact_sales_form_submitted` | User submits the contact sales form for enterprise plan | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `team_member_invited` | Admin/owner invites a team member via email | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `invite_link_accepted` | User accepts an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-page.tsx` |
| `user_account_deleted` | User deletes their account | `app/features/user-accounts/settings/account/danger-zone.tsx` |
| `pricing_page_viewed` | User views the pricing page (top of conversion funnel) | `app/routes/pricing.tsx` |

## Files Modified/Created

### New Files
- `app/lib/posthog-middleware.ts` - Server-side PostHog middleware for React Router

### Modified Files
- `app/entry.client.tsx` - Added PostHog initialization and provider
- `app/root.tsx` - Added middleware and error boundary tracking
- `.env` - Added PostHog environment variables
- Various route and component files (see table above)

## Next steps

We recommend creating an "Analytics basics" dashboard in PostHog with the following insights:

1. **Registration to Paid Conversion Funnel**: `user_registered` -> `onboarding_user_account_completed` -> `onboarding_organization_completed` -> `subscription_payment_successful`
2. **Pricing Page Conversion**: `pricing_page_viewed` -> `subscription_checkout_started` -> `subscription_payment_successful`
3. **Churn Analysis**: Track `subscription_cancelled` over time with breakdown by tier
4. **Team Growth**: `organization_created` and `team_member_invited` trends
5. **Enterprise Lead Generation**: `contact_sales_form_submitted` tracking

Visit your PostHog dashboard at https://us.i.posthog.com to create these insights and monitor your user behavior.

## Packages Installed

- `posthog-js` - Client-side PostHog SDK
- `posthog-node` - Server-side PostHog SDK
- `@posthog/react` - React integration for PostHog
