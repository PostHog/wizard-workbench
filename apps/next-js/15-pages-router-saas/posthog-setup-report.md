# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js Pages Router SaaS project with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic page view tracking and error capturing
- **Server-side tracking** support via `lib/posthog-server.ts` for API route events
- **Reverse proxy** configuration in `next.config.ts` to route PostHog requests through `/ingest` for better ad-blocker resistance
- **Environment variables** configured in `.env` using the `NEXT_PUBLIC_` prefix for Next.js compatibility
- **User identification** on sign-in and sign-up to link anonymous sessions to authenticated users
- **Error tracking** with `captureException` calls in catch blocks throughout the application
- **PostHog reset** on sign-out to properly unlink user sessions

## Events Added

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `sign_in_failed` | User sign in attempt failed due to invalid credentials or error | `components/login.tsx` |
| `sign_up_failed` | User sign up attempt failed due to validation or server error | `components/login.tsx` |
| `checkout_started` | User initiated the checkout process for a subscription plan | `pages/pricing.tsx` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `pages/pricing.tsx` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | Team owner removed a member from the team | `pages/dashboard/index.tsx` |
| `manage_subscription_clicked` | User clicked to manage their subscription in Stripe customer portal | `pages/dashboard/index.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `.env` | Created | PostHog API key and host configuration |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Created | Server-side PostHog client for API routes |
| `next.config.ts` | Modified | Added rewrites for PostHog reverse proxy |
| `components/login.tsx` | Modified | Added sign-in/sign-up events and user identification |
| `components/header.tsx` | Modified | Added sign-out event and PostHog reset |
| `pages/pricing.tsx` | Modified | Added checkout and page view events |
| `pages/dashboard/index.tsx` | Modified | Added team and subscription management events |

## Next steps

1. **Create a dashboard in PostHog** with the following suggested insights:

   - **Sign-up to Checkout Funnel**: Track conversion from `user_signed_up` → `pricing_page_viewed` → `checkout_started`
   - **Authentication Overview**: Compare `user_signed_in` vs `sign_in_failed` events over time
   - **Team Growth**: Track `team_member_invited` events to measure collaboration adoption
   - **Subscription Management**: Monitor `manage_subscription_clicked` to understand billing engagement
   - **User Retention**: Compare `user_signed_in` vs `user_signed_out` patterns

2. **Visit your PostHog dashboard** at https://us.i.posthog.com to:
   - View real-time events as users interact with your app
   - Create custom insights based on the events above
   - Set up session recordings to watch user behavior
   - Configure feature flags for gradual rollouts

3. **Consider adding more events** for:
   - Account settings changes
   - Error page views (404)
   - Specific feature interactions
