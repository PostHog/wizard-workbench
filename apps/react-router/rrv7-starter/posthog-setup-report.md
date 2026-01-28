# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 Framework mode application. The integration includes:

- **Client-side SDK initialization** via `entry.client.tsx` with PostHogProvider wrapping the app
- **Server-side middleware** for correlating client/server events using session and distinct ID headers
- **Error boundary integration** in `root.tsx` for automatic exception capture
- **Custom event tracking** across key user interactions and conversion flows
- **Environment variable configuration** using Vite's `VITE_PUBLIC_` prefix convention

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `follower_package_selected` | User selected a follower package on the buy followers page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completed a fake follower purchase (main conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User liked a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unliked a post in the feed | `app/components/PostCard.tsx` |
| `user_followed_back` | User followed back a fake follower from the profile page | `app/routes/profile.tsx` |
| `cta_buy_followers_clicked` | User clicked Buy Followers CTA button in header | `app/components/header.tsx` |
| `home_cta_feed_clicked` | User clicked View Feed CTA on home page | `app/routes/home.tsx` |
| `home_cta_buy_followers_clicked` | User clicked Buy Fake Followers CTA on home page | `app/routes/home.tsx` |

## Files Created/Modified

### New Files
- `app/entry.client.tsx` - PostHog client-side initialization with PostHogProvider
- `app/lib/posthog-middleware.ts` - Server-side middleware for session correlation
- `.env` - Environment variables with PostHog API key and host

### Modified Files
- `app/root.tsx` - Added error boundary with PostHog exception capture and middleware export
- `app/routes/buy-followers.tsx` - Added conversion tracking events
- `app/routes/home.tsx` - Added CTA click tracking
- `app/routes/profile.tsx` - Added follow-back tracking
- `app/components/header.tsx` - Added header CTA tracking
- `app/components/PostCard.tsx` - Added post like/unlike tracking
- `vite.config.ts` - Added PostHog packages to SSR noExternal
- `react-router.config.ts` - Enabled v8_middleware future flag
- `.env.example` - Added PostHog environment variable templates

## Next steps

### Create a Dashboard

To create a dashboard with insights based on these events, go to your PostHog project and:

1. Navigate to **Dashboards** > **New Dashboard**
2. Name it "Analytics basics" or "CloutHub Analytics"
3. Add these recommended insights:

**Recommended Insights:**

1. **Conversion Funnel**: `home_cta_buy_followers_clicked` > `follower_package_selected` > `followers_purchased`
2. **Total Purchases Trend**: Count of `followers_purchased` over time
3. **Engagement Rate**: Count of `post_liked` events over time
4. **CTA Performance**: Compare `cta_buy_followers_clicked` vs `home_cta_buy_followers_clicked`
5. **User Retention**: Users who performed `user_followed_back` returning to perform other actions

### Environment Variables

Make sure your production environment has these variables set:
```
VITE_PUBLIC_POSTHOG_KEY=<your-posthog-project-api-key>
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

The skill includes:
- Example project code demonstrating best practices
- Framework-specific documentation
- User identification patterns
- Error tracking guidance
