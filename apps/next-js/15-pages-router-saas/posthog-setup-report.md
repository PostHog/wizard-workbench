# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 Pages Router SaaS project with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Server-side tracking** via `lib/posthog-server.ts` for API route events
- **Reverse proxy** configured in `next.config.ts` to route PostHog requests through `/ingest` for improved ad-blocker bypass
- **User identification** on both client and server side for consistent user tracking across sessions
- **Error tracking** with `posthog.captureException()` in all catch blocks for comprehensive error monitoring
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully completed the sign-up process and created an account | `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User initiated a checkout process to purchase a subscription plan | `pages/pricing.tsx` |
| `subscription_managed` | User clicked to manage their subscription via Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | User invited a new team member via email | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removed a team member from their team | `pages/dashboard/index.tsx` |
| `account_updated` | User updated their account information (name or email) | `pages/dashboard/general.tsx` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `pages/pricing.tsx` |
| `server_user_signed_in` | Server-side event for user sign-in | `pages/api/auth/sign-in.ts` |
| `server_user_signed_up` | Server-side event for user sign-up | `pages/api/auth/sign-up.ts` |

## Files Modified

| File | Changes |
|------|---------|
| `instrumentation-client.ts` | **Created** - Client-side PostHog initialization |
| `lib/posthog-server.ts` | **Created** - Server-side PostHog client helper |
| `next.config.ts` | **Modified** - Added rewrites for PostHog proxy |
| `.env` | **Modified** - Added PostHog environment variables |
| `components/login.tsx` | **Modified** - Added sign-in/sign-up events and user identification |
| `components/header.tsx` | **Modified** - Added sign-out event and PostHog reset |
| `pages/pricing.tsx` | **Modified** - Added checkout_started and pricing_page_viewed events |
| `pages/dashboard/index.tsx` | **Modified** - Added subscription, team invite, and team remove events |
| `pages/dashboard/general.tsx` | **Modified** - Added account_updated event |
| `pages/api/auth/sign-in.ts` | **Modified** - Added server-side sign-in tracking and identification |
| `pages/api/auth/sign-up.ts` | **Modified** - Added server-side sign-up tracking and identification |

## Next steps

We've set up comprehensive event tracking for your SaaS application. To view your analytics:

1. **PostHog Dashboard**: Visit your PostHog project at https://us.posthog.com to view captured events
2. **Create Custom Insights**: Build funnels, trends, and retention charts based on the events above

### Recommended Insights to Create

Based on the events implemented, consider creating these insights in PostHog:

1. **Sign-up to Checkout Funnel**: `pricing_page_viewed` -> `user_signed_up` -> `checkout_started`
2. **User Activation Trend**: Track `user_signed_up` events over time
3. **Subscription Management**: Track `subscription_managed` events to understand subscription engagement
4. **Team Collaboration**: Track `team_member_invited` and `team_member_removed` for team health
5. **Account Engagement**: Track `account_updated` events for user engagement

### Quick Links

- [PostHog Documentation](https://posthog.com/docs)
- [Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)
- [Creating Funnels](https://posthog.com/docs/product-analytics/funnels)
- [Error Tracking](https://posthog.com/docs/error-tracking)
