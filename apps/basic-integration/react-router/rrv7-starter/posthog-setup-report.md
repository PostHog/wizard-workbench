<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode project (CloutHub — The Fake Influencer Social Network).

## Changes made

- **`app/entry.client.tsx`** (created): Initialises the PostHog JS SDK and wraps `HydratedRouter` in `PostHogProvider`, enabling the `usePostHog()` hook throughout the app. Autocapture, session replay, and pageview tracking are enabled by default.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to `ssr.noExternal` for dev-mode SSR bundling. Added ingest proxy routes (`/ingest`, `/ingest/static`, `/ingest/array`) to avoid CORS issues during development.
- **`app/root.tsx`**: Added `usePostHog` import and `posthog.captureException(error)` call inside `ErrorBoundary` to automatically report unhandled route errors.
- **`env.d.ts`**: Added TypeScript declarations for `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`.env`**: Populated `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (excluded from git via `.gitignore`).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `buy_followers_page_viewed` | User views the Buy Fake Followers page — top of the purchase conversion funnel | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User clicks a follower package card; includes amount, bonus, price, and total | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase — main conversion event | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed; includes post ID and username | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a previously liked post; includes post ID and username | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a fake bot follower from their profile page | `app/routes/profile.tsx` |
| `analytics_page_viewed` | User views the Analytics dashboard — key funnel step | `app/routes/analytics.tsx` |

## Next steps

We recommend building the following insights in your [PostHog dashboard](/dashboard):

- **Purchase conversion funnel** — `buy_followers_page_viewed` → `follower_package_selected` → `followers_purchased`
- **Follower package trends** — trend of `follower_package_selected` broken down by `package_price`
- **Post engagement** — total `post_liked` events over time
- **Followers purchased** — trend of `followers_purchased` with `total_followers` sum
- **Analytics page engagement** — trend of `analytics_page_viewed` vs `buy_followers_page_viewed`

> **Note**: The PostHog API key used by this wizard was missing `dashboard:write`, `insight:write`, and `query:read` scopes, so the dashboard could not be created automatically. You can add these scopes to your personal API key in [PostHog settings](/settings/user-api-keys) and re-run, or build the insights manually in the PostHog UI.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
