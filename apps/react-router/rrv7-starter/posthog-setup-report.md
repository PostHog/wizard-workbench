<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloutHub, a React Router v7 Framework mode application.

## Changes made

- **`app/entry.client.tsx`** *(created)*: Initializes the PostHog JS SDK with the project token and host from environment variables, then wraps the `HydratedRouter` in a `PostHogProvider` so all components can access PostHog via the `usePostHog()` hook.
- **`app/root.tsx`**: Added `usePostHog` import and `posthog.captureException(error)` in the `ErrorBoundary` to automatically report unhandled React Router errors to PostHog.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to the dev-mode `noExternal` SSR list so they are correctly bundled during development.
- **`app/routes/buy-followers.tsx`**: Added `follower_package_selected` event (fires when a user clicks a follower package) and `followers_purchased` event (fires when a purchase completes), both with package amount, bonus, price, and total follower properties.
- **`app/components/PostCard.tsx`**: Added `post_liked` and `post_unliked` events (fires when the like button is toggled), with `post_id` and `post_username` properties.
- **`app/routes/profile.tsx`**: Added `follower_followed_back` event (fires when a user follows back a fake follower), with `follower_username` property.
- **`.env`** *(created)*: Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `follower_package_selected` | User selects a follower package on the Buy Followers page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase — key conversion event | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a fake follower on the profile page | `app/routes/profile.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Follower Purchase Funnel** — A funnel insight tracking: `$pageview` (url contains `/buy-followers`) → `follower_package_selected` → `followers_purchased`
2. **Followers Purchased over time** — A trends line chart for the `followers_purchased` event, broken down by `package_amount`
3. **Post Engagement** — A trends bar chart comparing `post_liked` vs `post_unliked` events over time
4. **Top Packages by Revenue** — A table insight on `followers_purchased` with `package_price` as the property, aggregated as total
5. **Follow-back Rate** — A trends line chart for `follower_followed_back` events

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
