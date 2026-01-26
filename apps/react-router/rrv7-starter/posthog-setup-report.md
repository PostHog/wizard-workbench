<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 Framework mode application. The integration includes:

- **Client-side SDK initialization** via `app/entry.client.tsx` with PostHogProvider wrapping the app
- **Server-side middleware** for correlating client and server events using session/distinct ID headers
- **Error boundary tracking** to automatically capture exceptions in your app
- **Custom event tracking** for key user actions and conversion events

## Events implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `follower_package_selected` | User selected a follower package to purchase | `app/routes/buy-followers.tsx` |
| `follower_package_purchased` | User completed a fake follower purchase (conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User liked a post in the feed | `app/components/PostCard.tsx` |
| `user_followed` | User followed another user from profile page | `app/routes/profile.tsx` |
| `cta_clicked` | User clicked a call-to-action button on the home page | `app/routes/home.tsx` |
| `buy_followers_header_clicked` | User clicked the Buy Followers button in the header | `app/components/header.tsx` |

## Files created/modified

### New files
- `app/entry.client.tsx` - PostHog client-side initialization with PostHogProvider
- `app/lib/posthog/middleware.ts` - Server-side PostHog middleware for request context
- `.env` - Environment variables for PostHog API key and host

### Modified files
- `app/root.tsx` - Added middleware registration and error boundary tracking
- `react-router.config.ts` - Enabled v8_middleware feature flag
- `vite.config.ts` - Added PostHog packages to SSR noExternal configuration
- `app/routes/buy-followers.tsx` - Added package selection and purchase events
- `app/components/PostCard.tsx` - Added post like event
- `app/routes/profile.tsx` - Added user followed event
- `app/routes/home.tsx` - Added CTA click events
- `app/components/header.tsx` - Added header buy button click event

## Next steps

Once your application is running and capturing events, you can create insights and dashboards in PostHog:

1. **Conversion Funnel**: Track the journey from `cta_clicked` → `follower_package_selected` → `follower_package_purchased`
2. **Engagement Metrics**: Monitor `post_liked` and `user_followed` events to understand user engagement
3. **CTA Performance**: Compare click rates across different CTAs using the `cta_clicked` event properties

Visit your [PostHog dashboard](https://us.i.posthog.com) to:
- View captured events in the Activity tab
- Create custom insights based on the events above
- Set up funnels to track conversion rates
- Configure session replay to see user interactions

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
