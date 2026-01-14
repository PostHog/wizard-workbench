# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router 7 Framework project. The following changes were made:

## Integration Summary

### Core Setup Files
- **`app/entry.client.tsx`** - Created client-side entry point with PostHog initialization using `PostHogProvider`
- **`app/lib/posthog-middleware.ts`** - Created server-side middleware for request context tracking with session/user correlation
- **`react-router.config.ts`** - Enabled v8_middleware future flag for server-side tracking
- **`vite.config.ts`** - Added PostHog packages to SSR noExternal config
- **`.env`** - Added PostHog environment variables (API key and host)
- **`env.d.ts`** - Added TypeScript declarations for PostHog environment variables

### Event Tracking Implementation

| Event Name | Description | File |
|------------|-------------|------|
| `follower_package_selected` | User selects a follower package to purchase | `app/routes/buy-followers.tsx` |
| `follower_package_purchased` | User completes purchase of fake followers - key conversion event | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `user_followed` | User follows back another user from their profile | `app/routes/profile.tsx` |
| `cta_clicked` | User clicks a call-to-action button on the home page | `app/routes/home.tsx` |
| `buy_followers_cta_clicked` | User clicks Buy Followers button in header navigation | `app/components/header.tsx` |
| `navigation_link_clicked` | User clicks navigation link in header | `app/components/header.tsx` |
| `error_boundary_triggered` | An error was caught by the error boundary (via `captureException`) | `app/root.tsx` |

### Error Tracking
- Error boundary in `app/root.tsx` now captures exceptions via `posthog.captureException(error)`

### Server-Side Tracking
- Middleware automatically extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers
- Server-side events are correlated with client-side sessions via `posthog.withContext()`

## Environment Variables

The following environment variables are required:

```bash
VITE_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

### Recommended Dashboard & Insights

Create the following insights in your PostHog dashboard to track key metrics:

1. **Purchase Funnel** (Funnel Insight)
   - Step 1: `buy_followers_cta_clicked` OR `cta_clicked` (where cta_name = 'buy_fake_followers')
   - Step 2: `follower_package_selected`
   - Step 3: `follower_package_purchased`

2. **Engagement Metrics** (Trends Insight)
   - Track `post_liked`, `post_unliked`, `user_followed` over time

3. **Navigation Patterns** (Trends Insight)
   - Track `navigation_link_clicked` broken down by `link_name` property

4. **Revenue by Package** (Trends Insight)
   - Track `follower_package_purchased` with sum of `price` property

5. **Error Tracking** (Trends Insight)
   - Monitor `$exception` events to track application stability

### Creating Your Dashboard

1. Go to [PostHog Dashboards](https://us.posthog.com/dashboard)
2. Click "New dashboard" → "Analytics basics"
3. Add the insights above using the event names from this integration

### Useful Links

- [PostHog Documentation](https://posthog.com/docs)
- [React Integration Guide](https://posthog.com/docs/libraries/react)
- [Creating Funnels](https://posthog.com/docs/product-analytics/funnels)
- [Error Tracking](https://posthog.com/docs/error-tracking)

---

*Integration completed by PostHog Setup Wizard*
