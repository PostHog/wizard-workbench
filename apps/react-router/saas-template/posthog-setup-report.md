# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router 7 SaaS template. The integration includes:

- **Client-side tracking**: PostHog is initialized in `app/entry.client.tsx` with the `PostHogProvider` wrapping your application, enabling automatic page view tracking and custom event capture.
- **Server-side tracking**: A middleware in `app/lib/posthog-middleware.server.ts` initializes PostHog on each request, passing session and distinct IDs from headers for cross-platform user tracking.
- **Error boundary integration**: The root error boundary in `app/root.tsx` now captures exceptions to PostHog using `captureException()`.
- **SSR compatibility**: Vite is configured with `ssr.noExternal` for PostHog packages to avoid SSR errors.
- **15 business-critical events** have been instrumented across authentication, onboarding, organization management, billing, and team collaboration features.

## Events instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully completed registration and account was created | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | User successfully logged in via email OTP or OAuth | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | User logged out of their account (client-side with posthog.reset()) | `app/features/organizations/layout/nav-user.tsx` |
| `onboarding_user_account_completed` | User completed the user account step of onboarding | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | User completed organization setup during onboarding | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | User created a new organization (outside onboarding) | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `organization_deleted` | Organization owner deleted the organization | `app/features/organizations/settings/general/general-organization-settings-action.server.ts` |
| `checkout_session_started` | User initiated a checkout session to subscribe to a plan | `app/features/billing/billing-action.server.ts` |
| `subscription_created` | Stripe webhook: subscription was successfully created | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `subscription_cancelled` | User cancelled their subscription via billing portal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a cancelled subscription before period end | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switched to a different subscription plan | `app/features/billing/billing-action.server.ts` |
| `contact_sales_submitted` | User submitted the contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `team_member_invited` | Admin or owner sent an email invitation to a team member | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `invite_link_accepted` | User accepted an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |

## Configuration files modified

- `app/entry.client.tsx` - PostHog client initialization and PostHogProvider
- `app/root.tsx` - PostHog middleware registration and error boundary integration
- `app/lib/posthog-middleware.server.ts` - Server-side PostHog middleware (new file)
- `vite.config.ts` - SSR noExternal configuration for PostHog packages
- `.env` / `.env.example` - PostHog environment variables

## Next steps

Once you start receiving events, you can create insights and dashboards in PostHog to track:

1. **User Acquisition Funnel**: `user_signed_up` -> `onboarding_user_account_completed` -> `onboarding_organization_completed`
2. **Conversion Funnel**: `checkout_session_started` -> `subscription_created`
3. **Churn Analysis**: Track `subscription_cancelled` events and compare with `subscription_resumed`
4. **Team Growth**: Monitor `team_member_invited` and `invite_link_accepted` events
5. **Enterprise Interest**: Track `contact_sales_submitted` for high-value lead generation

Visit your PostHog dashboard at: https://us.i.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
