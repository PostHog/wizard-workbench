# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 Pages Router SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageview tracking and session replay
- **Server-side tracking** via `posthog-node` for API route events
- **User identification** on both client and server side to correlate behavior across sessions
- **Error tracking** with `posthog.captureException()` for catching and reporting errors
- **Reverse proxy setup** in `next.config.ts` to route analytics through your domain

## Files Created

| File | Description |
|------|-------------|
| `.env` | Environment variables for PostHog API key and host |
| `instrumentation-client.ts` | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Server-side PostHog client helper |

## Files Modified

| File | Description |
|------|-------------|
| `next.config.ts` | Added rewrites for PostHog reverse proxy |
| `components/login.tsx` | Added sign-in/sign-up event tracking and user identification |
| `components/header.tsx` | Added sign-out event tracking |
| `pages/pricing.tsx` | Added pricing page view and checkout started events |
| `pages/dashboard/index.tsx` | Added subscription management, team invite, and team member removal events |
| `pages/dashboard/general.tsx` | Added account update event tracking |
| `pages/api/auth/sign-in.ts` | Added server-side sign-in tracking and user identification |
| `pages/api/auth/sign-up.ts` | Added server-side sign-up tracking and user identification |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `user_signed_in` | User successfully signed into their account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `sign_in_failed` | User attempted to sign in but failed | `components/login.tsx` |
| `sign_up_failed` | User attempted to sign up but failed | `components/login.tsx` |
| `pricing_page_viewed` | User viewed the pricing page (top of funnel) | `pages/pricing.tsx` |
| `checkout_started` | User initiated checkout for a subscription plan | `pages/pricing.tsx` |
| `subscription_managed` | User clicked to manage their subscription | `pages/dashboard/index.tsx` |
| `team_member_invited` | User sent an invitation to a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removed a member from their team | `pages/dashboard/index.tsx` |
| `account_updated` | User updated their account information | `pages/dashboard/general.tsx` |
| `server_sign_in` | Server-side sign-in event | `pages/api/auth/sign-in.ts` |
| `server_sign_up` | Server-side sign-up event | `pages/api/auth/sign-up.ts` |

## Environment Variables

The following environment variables have been configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

### Recommended Dashboard Insights

To get the most out of your PostHog integration, create the following insights in your PostHog dashboard:

1. **Sign-up to Checkout Funnel**: Track conversion from `user_signed_up` → `pricing_page_viewed` → `checkout_started`
2. **Authentication Events**: Monitor `user_signed_in`, `user_signed_out`, `sign_in_failed`, `sign_up_failed` events
3. **Team Activity**: Track `team_member_invited` and `team_member_removed` events
4. **Subscription Management**: Monitor `subscription_managed` clicks to understand billing engagement
5. **Account Updates**: Track `account_updated` events to understand user profile engagement

### Access PostHog

- PostHog Dashboard: https://us.posthog.com
- Project API Key: `sTMFPsFhdP1Ssg`

### Testing the Integration

1. Start your development server with `pnpm dev`
2. Navigate through the app and perform actions (sign up, sign in, view pricing, etc.)
3. Open PostHog to see events appearing in real-time
4. Use Session Replay to watch user sessions
