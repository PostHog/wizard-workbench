<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloutHub, a satirical fake influencer social media app built with React Router v7 (Framework mode).

## Summary of changes

- **`app/entry.client.tsx`** *(created)* — Initializes the PostHog JS SDK and wraps the app with `PostHogProvider`. The `__add_tracing_headers` option is set so client session/distinct IDs are automatically forwarded to the server on every request.
- **`app/lib/posthog-middleware.ts`** *(created)* — Server-side PostHog Node middleware. Creates a PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers from the client, and calls `withContext()` so all server-side events are correlated with the same user/session as client events.
- **`app/root.tsx`** — Registers the PostHog middleware via `export const middleware` and captures uncaught errors in the `ErrorBoundary` using `posthog?.captureException(error)`.
- **`react-router.config.ts`** — Added `future: { v8_middleware: true }` to enable the middleware feature flag.
- **`vite.config.ts`** — Added `posthog-js` and `@posthog/react` to `ssr.noExternal` so they are correctly bundled during SSR dev mode.
- **`env.d.ts`** — Added TypeScript types for `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`app/routes/home.tsx`** — Tracks CTA clicks on the homepage hero section.
- **`app/routes/buy-followers.tsx`** — Tracks follower package selection and completed purchases (primary conversion funnel).
- **`app/components/PostCard.tsx`** — Tracks post likes and unlikes in the feed.
- **`app/routes/profile.tsx`** — Tracks follow-back actions on bot followers.
- **`app/routes/analytics.tsx`** — Tracks analytics dashboard views.

## Events

| Event | Description | File |
|---|---|---|
| `view_feed_cta_clicked` | User clicks "View Feed" CTA on the home page hero section | `app/routes/home.tsx` |
| `buy_followers_cta_clicked` | User clicks "Buy Fake Followers" CTA on the home page hero section | `app/routes/home.tsx` |
| `follower_package_selected` | User selects a follower package (top of conversion funnel) | `app/routes/buy-followers.tsx` |
| `fake_followers_purchased` | User completes a fake follower purchase (primary conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follow_back_clicked` | User clicks "Follow back" on a bot follower | `app/routes/profile.tsx` |
| `analytics_dashboard_viewed` | User views the analytics dashboard | `app/routes/analytics.tsx` |

## Next steps

We've set up the events above — now head to PostHog to build your "Analytics basics" dashboard. Here are five recommended insights to create:

1. **Follower Purchase Conversion Funnel** — Create a Funnel insight with steps: `buy_followers_cta_clicked` → `follower_package_selected` → `fake_followers_purchased`. This shows where users drop off in the purchase flow.
   - [Create Funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Fake Followers Purchased — Total Revenue Equivalent** — Create a Trends insight tracking `fake_followers_purchased`, using the `price` property as a sum. Shows total fake revenue over time.
   - [Create Trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Post Engagement — Likes vs Unlikes** — Create a Trends insight with two series: `post_liked` and `post_unliked`. Compare like/unlike rates over time to measure feed engagement.
   - [Create Trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Homepage CTA Clicks** — Create a Trends insight with two series: `buy_followers_cta_clicked` and `view_feed_cta_clicked`. Understand which homepage CTA drives more traffic.
   - [Create Trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Follow-back Activity** — Create a Trends insight for `follow_back_clicked` to track social engagement in the profile page over time.
   - [Create Trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

Once you've created the insights, add them all to a new dashboard called **"Analytics basics"**:
- [Create Dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
