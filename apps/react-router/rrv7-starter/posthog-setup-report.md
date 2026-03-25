<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 Framework mode application. The following changes were made:

- **`app/entry.client.tsx`** (new): Initializes the PostHog JS SDK and wraps the app with `PostHogProvider`, enabling client-side tracking, session replay, and feature flags.
- **`app/lib/posthog-middleware.ts`** (new): Server-side PostHog middleware that creates a PostHog Node client per request, extracts session and distinct ID headers from the client SDK, and makes the client available via request context for server-side event tracking.
- **`app/root.tsx`** (modified): Exports the PostHog middleware for all routes, and adds `captureException` in the `ErrorBoundary` to automatically track unhandled errors.
- **`react-router.config.ts`** (modified): Added `future.v8_middleware: true` to enable the React Router middleware API.
- **`vite.config.ts`** (modified): Added PostHog packages to SSR `noExternal` list for dev mode, and added a `/ingest` proxy to route PostHog events through the dev server (avoids ad-blockers).
- **`app/routes/buy-followers.tsx`** (modified): Tracks package selection and purchase completion with price and follower count properties.
- **`app/components/PostCard.tsx`** (modified): Tracks post likes/unlikes with post ID and username.
- **`app/routes/profile.tsx`** (modified): Tracks when users follow back a bot follower.
- **`app/routes/home.tsx`** (modified): Tracks CTA button clicks (View Feed, Buy Fake Followers).

| Event | Description | File |
|-------|-------------|------|
| `follower_package_selected` | User selects a follower package on the buy-followers page | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | User completes a fake follower purchase (with price and follower count) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks Follow back on a follower in their profile | `app/routes/profile.tsx` |
| `cta_clicked` | User clicks a main CTA button on the home page | `app/routes/home.tsx` |

## Next steps

To visualize these events, create an **"Analytics basics"** dashboard in PostHog and add the following insights:

1. **Follower Purchase Funnel** — Create a Funnel insight with steps: `cta_clicked` (where `cta = buy_fake_followers`) → `follower_package_selected` → `follower_purchase_completed`. This shows your core conversion funnel.

2. **Follower Purchases Over Time** — A Trends insight showing `follower_purchase_completed` volume over time. Add `total_followers` as a property to track how many followers are being purchased.

3. **Post Engagement (Likes)** — A Trends insight tracking `post_liked` (where `liked = true`) to measure feed engagement.

4. **CTA Click Distribution** — A Trends insight with `cta_clicked` broken down by the `cta` property, showing which CTAs drive more clicks.

5. **Follow-Back Rate** — A Trends insight showing `follower_followed_back` events to understand profile engagement.

You can access your PostHog project here: [PostHog Project 238460](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
