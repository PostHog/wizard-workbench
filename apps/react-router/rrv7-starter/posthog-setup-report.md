# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your CloutHub React Router v7 project. The integration includes:

- **Client-side tracking** via `posthog-js` and `@posthog/react` with automatic pageview capture
- **Server-side middleware** using `posthog-node` for request context correlation
- **Error tracking** in the root error boundary using `captureException`
- **Event tracking** across key user interactions throughout the app

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `followers_package_selected` | User selected a fake followers package | `app/routes/buy-followers.tsx` |
| `followers_purchase_initiated` | User clicked the purchase button to buy fake followers | `app/routes/buy-followers.tsx` |
| `followers_purchase_completed` | Fake followers purchase completed successfully | `app/routes/buy-followers.tsx` |
| `user_followed_back` | User followed back a fake follower from their profile | `app/routes/profile.tsx` |
| `post_liked` | User liked a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unliked a post in the feed | `app/components/PostCard.tsx` |
| `cta_clicked` | User clicked a call-to-action button on the home page | `app/routes/home.tsx` |
| `buy_followers_header_clicked` | User clicked the buy followers button in the header | `app/components/header.tsx` |

## Files Modified/Created

| File | Changes |
|------|---------|
| `.env` | Created with PostHog API key and host environment variables |
| `app/entry.client.tsx` | Created - PostHog client initialization with `PostHogProvider` |
| `app/lib/posthog-middleware.ts` | Created - Server-side PostHog middleware for SSR |
| `app/root.tsx` | Added PostHog middleware and error tracking in `ErrorBoundary` |
| `react-router.config.ts` | Enabled middleware with `future.v8_middleware` |
| `vite.config.ts` | Added `posthog-js` and `@posthog/react` to SSR noExternal |
| `app/routes/buy-followers.tsx` | Added purchase funnel events |
| `app/routes/profile.tsx` | Added follow back event tracking |
| `app/components/PostCard.tsx` | Added like/unlike event tracking |
| `app/routes/home.tsx` | Added CTA click tracking |
| `app/components/header.tsx` | Added header buy button click tracking |

## Next steps

### Recommended Dashboard Insights

Create a dashboard named "Analytics Basics" in your PostHog project with these insights:

1. **Followers Purchase Funnel** - A funnel insight tracking:
   - `followers_package_selected` → `followers_purchase_initiated` → `followers_purchase_completed`

2. **User Engagement Overview** - A trends insight showing:
   - `post_liked` and `post_unliked` events over time

3. **CTA Performance** - A trends insight tracking:
   - `cta_clicked` events broken down by `cta_name` property

4. **Social Actions** - A trends insight for:
   - `user_followed_back` events

5. **Header Conversion** - A funnel tracking:
   - `buy_followers_header_clicked` → `followers_package_selected` → `followers_purchase_completed`

### Environment Variables

Make sure your `.env` file contains:
```
VITE_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

### Additional Resources

- [PostHog React Documentation](https://posthog.com/docs/libraries/react)
- [PostHog React Router Guide](https://posthog.com/docs/libraries/react-router)
- [PostHog Error Tracking](https://posthog.com/docs/error-tracking)
- [PostHog Session Replay](https://posthog.com/docs/session-replay)
