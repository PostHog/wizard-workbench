# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloutHub, a React Router v7 (Framework mode) app. The following changes were made:

- **`app/entry.client.tsx`** (created): Initializes `posthog-js`, wraps `HydratedRouter` in `PostHogProvider`, and configures the `/ingest` reverse-proxy path so analytics traffic routes through the app's own domain.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to `ssr.noExternal`, and added `/ingest`, `/ingest/static`, and `/ingest/array` proxy routes for dev.
- **`app/root.tsx`**: Added `usePostHog` and `captureException` in the global `ErrorBoundary` so unhandled React Router errors are automatically sent to PostHog Error Tracking.
- **`app/routes/home.tsx`**: Added `posthog.identify` on mount to associate the session with the known fake user.
- **`app/routes/buy-followers.tsx`**: Tracks `follower_package_selected` (with price/amount properties) and `follower_purchase_completed` (the primary conversion event).
- **`app/components/PostCard.tsx`**: Tracks `post_liked` and `post_unliked` with post ID and author metadata.
- **`app/routes/profile.tsx`**: Tracks `user_followed` when a user clicks "Follow back" on a listed follower.
- **`app/routes/feed.tsx`**: Tracks `feed_viewed` (top-of-funnel page entry) on mount.
- **`app/routes/analytics.tsx`**: Tracks `analytics_viewed` with current follower stats on mount.
- **`.env`** (created): Holds `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`package.json`**: `posthog-js`, `@posthog/react`, and `posthog-node` added as dependencies.

| Event | Description | File |
|---|---|---|
| `follower_package_selected` | User selects a follower package (price, amount, bonus) | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | User completes a fake follower purchase | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a previously liked post | `app/components/PostCard.tsx` |
| `user_followed` | User clicks "Follow back" on a listed follower | `app/routes/profile.tsx` |
| `feed_viewed` | User views the feed page (top of engagement funnel) | `app/routes/feed.tsx` |
| `analytics_viewed` | User views the analytics dashboard | `app/routes/analytics.tsx` |

## Next steps

The PostHog MCP API key used during this session was missing `dashboard:write` and `insight:write` scopes, so the dashboard could not be created automatically. You can build it manually in under a minute:

- [New dashboard](https://us.posthog.com/project/2/dashboard) — create one named **"Analytics basics (wizard)"** and add the insights below
- [New insight](https://us.posthog.com/project/2/insights/new) — recommended insights to add:

  1. **Follower purchase funnel** — Funnel from `feed_viewed` → `follower_package_selected` → `follower_purchase_completed`
  2. **Purchase conversion trend** — Trends line chart of `follower_purchase_completed` over time
  3. **Post engagement** — Trends breakdown of `post_liked` + `post_unliked` over time
  4. **Package selection rate** — Trends: `follower_package_selected` / `feed_viewed` as formula insight
  5. **Analytics & feed views** — Trends line chart of `feed_viewed` + `analytics_viewed` side-by-side

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap/onboarding scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `identify` is on the home page `useEffect`, so users who navigate directly to `/feed` or `/buy-followers` without visiting home first may not be identified until they return to `/`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
