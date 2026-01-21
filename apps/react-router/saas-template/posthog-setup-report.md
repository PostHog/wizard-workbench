# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router 7 Framework mode SaaS template. The integration includes:

- **Client-side SDK**: PostHog JavaScript SDK (`posthog-js`) with React context provider (`@posthog/react`)
- **Server-side SDK**: PostHog Node SDK (`posthog-node`) for server-side event tracking
- **Middleware**: Server-side middleware that automatically links client sessions with server events via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers
- **Error boundary**: Automatic exception capture in the root error boundary
- **Environment variables**: `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` configured

## Events Instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `user signed up` | User successfully registered via email or Google OAuth | `app/features/user-authentication/registration/register-action.server.ts` |
| `user logged in` | User successfully logged in via email OTP or Google OAuth | `app/features/user-authentication/login/login-action.server.ts` |
| `onboarding user account completed` | User completed the user account onboarding step | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding organization completed` | User completed the organization onboarding step | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization created` | User created a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `checkout started` | User initiated a subscription checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription cancelled` | User initiated cancellation of their subscription | `app/features/billing/billing-action.server.ts` |
| `subscription resumed` | User resumed their previously cancelled subscription | `app/features/billing/billing-action.server.ts` |
| `subscription plan switched` | User initiated a switch to a different subscription plan | `app/features/billing/billing-action.server.ts` |
| `contact sales submitted` | User submitted the contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `email invite accepted` | User accepted an email invitation to join an organization | `app/features/organizations/accept-email-invite/accept-email-invite-action.server.ts` |
| `invite link accepted` | User accepted an invite link to join an organization | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |
| `checkout completed` | Stripe checkout session completed (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription created` | New subscription created (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription deleted` | Subscription deleted/cancelled (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |

## Files Created/Modified

### New Files
- `app/lib/posthog/posthog-middleware.server.ts` - Server-side PostHog middleware
- `.env` - Environment variables with PostHog API key and host

### Modified Files
- `app/entry.client.tsx` - Added PostHog initialization and PostHogProvider
- `app/root.tsx` - Added PostHog middleware and error boundary exception capture
- `vite.config.ts` - Added SSR `noExternal` config for PostHog packages
- `.env.example` - Added PostHog environment variable placeholders

## Next steps

We recommend creating a dashboard in PostHog with the following insights based on the events instrumented:

1. **User Signup Funnel**: Track conversion from signup to onboarding completion
   - `user signed up` -> `onboarding user account completed` -> `onboarding organization completed`

2. **Checkout Conversion**: Track checkout initiation to completion
   - `checkout started` -> `checkout completed` -> `subscription created`

3. **Subscription Churn**: Monitor cancellation and resumption patterns
   - `subscription cancelled` vs `subscription resumed` over time

4. **Organization Growth**: Track new organizations and team invites
   - `organization created`, `email invite accepted`, `invite link accepted`

5. **Login Activity**: Monitor user engagement through login events
   - `user logged in` by login method (email vs google)

To create these insights, visit your [PostHog Dashboard](https://us.posthog.com/).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
