# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router 7 Framework mode SaaS application. This integration includes:

- **Client-side SDK initialization** via `entry.client.tsx` with the PostHogProvider wrapping the entire app
- **Server-side middleware** (`app/lib/posthog-middleware.ts`) for request-scoped PostHog instances with session/user correlation
- **Error tracking** in both the root `ErrorBoundary` and `GeneralErrorBoundary` components using `captureException`
- **SSR support** with proper Vite configuration (`ssr.noExternal` for posthog packages)
- **Event tracking** across authentication, billing, organizations, and team management flows

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user signed up` | User successfully registered an account (email OTP sent or Google OAuth initiated) | `app/features/user-authentication/registration/register-action.server.ts` |
| `user logged in` | User successfully logged in (email OTP sent or Google OAuth initiated) | `app/features/user-authentication/login/login-action.server.ts` |
| `user logged out` | User logged out of their account | `app/routes/_user-authentication+/logout.ts` |
| `organization created` | User completed onboarding and created an organization | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `checkout started` | User clicked to start a subscription checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription created` | Stripe webhook confirmed a new subscription was created | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription cancelled` | User initiated subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription resumed` | User resumed a previously cancelled subscription | `app/features/billing/billing-action.server.ts` |
| `plan changed` | User switched to a different subscription plan | `app/features/billing/billing-action.server.ts` |
| `contact sales submitted` | User submitted the enterprise contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `team member invited` | Admin invited a new team member via email | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `invite link created` | Admin created or refreshed an organization invite link | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `invite accepted` | User accepted an organization invitation | `app/features/organizations/accept-email-invite/accept-email-invite-action.server.ts` |

## Files Modified/Created

### New Files
- `app/lib/posthog-middleware.ts` - Server-side PostHog middleware for session/user correlation

### Modified Files
- `app/entry.client.tsx` - Added PostHog initialization and PostHogProvider
- `app/root.tsx` - Added PostHog middleware and error boundary exception capture
- `vite.config.ts` - Added SSR configuration for PostHog packages
- `app/components/general-error-boundary.tsx` - Added exception capture
- `.env.example` - Added PostHog environment variables
- `.env` - Created with PostHog configuration

## Environment Variables

The following environment variables have been configured:

```env
VITE_PUBLIC_POSTHOG_KEY="phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE"
VITE_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
```

## Next steps

Once you start capturing events, you can use PostHog to:

1. **Build Funnels**: Create conversion funnels like `user signed up` -> `organization created` -> `checkout started` -> `subscription created`
2. **Track Retention**: Monitor user engagement with login/logout patterns
3. **Analyze Churn**: Track `subscription cancelled` events and correlate with user behavior
4. **Session Replay**: Watch user sessions to understand their journey through your app
5. **Feature Flags**: Use PostHog's feature flags to gradually roll out new features

Visit your PostHog dashboard to create insights and dashboards based on these events.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog with:

- React Router v7 Framework mode patterns
- Server-side and client-side tracking best practices
- Error tracking and exception capture
- User identification and session correlation
