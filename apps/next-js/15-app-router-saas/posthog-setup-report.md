# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js SaaS project with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side tracking** via `posthog-node` for all server actions
- **User identification** on both client and server side for seamless cross-session tracking
- **Event capture** for key business events including signups, logins, checkouts, and team management
- **Error tracking** enabled via `capture_exceptions: true`
- **Proxy configuration** in `next.config.ts` to avoid ad blockers

## Events Added

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | Tracks when a user successfully creates a new account | `app/(login)/actions.ts` |
| `user_signed_in` | Tracks when a user successfully signs in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | Tracks when a user signs out of their account | `app/(login)/actions.ts`, `app/(dashboard)/layout.tsx` |
| `checkout_started` | Tracks when a user initiates the checkout process to subscribe to a plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `pricing_page_viewed` | Tracks when a user views the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |
| `team_member_invited` | Tracks when a team owner invites a new member to the team | `app/(login)/actions.ts` |
| `team_member_removed` | Tracks when a team owner removes a member from the team | `app/(login)/actions.ts` |
| `password_updated` | Tracks when a user successfully updates their password | `app/(login)/actions.ts` |
| `account_updated` | Tracks when a user updates their account information (name/email) | `app/(login)/actions.ts` |
| `account_deleted` | Tracks when a user deletes their account (churn event) | `app/(login)/actions.ts` |
| `manage_subscription_clicked` | Tracks when a user clicks to manage their subscription in the customer portal | `app/(dashboard)/dashboard/page.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env` - Environment variables with PostHog configuration

### Modified Files
- `next.config.ts` - Added PostHog proxy rewrites and trailing slash redirect config
- `app/(login)/actions.ts` - Added server-side event tracking and user identification
- `app/(dashboard)/pricing/page.tsx` - Added pricing page view tracking
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout started tracking
- `app/(dashboard)/dashboard/page.tsx` - Added manage subscription click tracking
- `app/(dashboard)/layout.tsx` - Added client-side user identification and sign out tracking

## Next Steps

We recommend creating the following insights in your PostHog dashboard to monitor user behavior based on the events instrumented:

1. **Signup to Checkout Funnel** - Track conversion from `user_signed_up` -> `pricing_page_viewed` -> `checkout_started`
2. **User Authentication Trends** - Monitor `user_signed_in` and `user_signed_out` events over time
3. **Churn Analysis** - Track `account_deleted` events to understand user churn patterns
4. **Team Growth Metrics** - Monitor `team_member_invited` and `team_member_removed` events
5. **Subscription Management** - Track `manage_subscription_clicked` to understand billing portal usage

### Creating Your Dashboard

To create these insights in PostHog:

1. Go to your PostHog project: https://us.posthog.com
2. Navigate to **Dashboards** > **New Dashboard**
3. Name it "SaaS Analytics" or similar
4. Add insights using the events listed above

### Environment Variables

Make sure your `.env` file contains:
```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Documentation

- [PostHog Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)
- [PostHog Identify Documentation](https://posthog.com/docs/product-analytics/identify)
- [PostHog Error Tracking](https://posthog.com/docs/error-tracking)
