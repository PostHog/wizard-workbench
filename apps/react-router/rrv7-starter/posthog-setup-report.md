<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your **CloutHub** React Router v7 (Framework mode) application.

## Summary of changes

- **`app/entry.client.tsx`** _(new file)_ — Initializes the PostHog JS SDK and wraps the app with `PostHogProvider` so that all components can access PostHog via the `usePostHog` hook. Configures `__add_tracing_headers` for client–server session correlation.
- **`vite.config.ts`** — Added `posthog-js` and `@posthog/react` to the `ssr.noExternal` list for dev mode, preventing SSR bundling errors.
- **`app/root.tsx`** — Added error tracking in the `ErrorBoundary` via `posthog?.captureException(error)` so unhandled React Router errors are automatically sent to PostHog.
- **`app/routes/home.tsx`** — Captures `buy_followers_cta_clicked` when a user clicks the hero CTA, marking the top of the purchase conversion funnel.
- **`app/routes/buy-followers.tsx`** — Captures `package_selected` (with price, amount, bonus, and total) when a user selects a package, and `purchase_completed` (with price, followers added, and new total) on purchase confirmation.
- **`app/components/PostCard.tsx`** — Captures `post_liked` and `post_unliked` with `post_id` and `post_username` properties on feed interactions.
- **`app/routes/profile.tsx`** — Captures `follow_back_clicked` with `target_username` when a user follows back a bot follower.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`env.d.ts`** — Added TypeScript declarations for the PostHog environment variables.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `buy_followers_cta_clicked` | User clicks the "Buy Fake Followers" CTA on the home page — top of the purchase funnel | `app/routes/home.tsx` |
| `package_selected` | User selects a follower package; includes price, amount, bonus, total followers | `app/routes/buy-followers.tsx` |
| `purchase_completed` | User completes a fake follower purchase (key conversion event); includes price, followers added, new total | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post on the feed; includes post_id, post_username | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post on the feed; includes post_id, post_username | `app/components/PostCard.tsx` |
| `follow_back_clicked` | User clicks "Follow back" on a bot follower in the profile page; includes target_username | `app/routes/profile.tsx` |

## Next steps

To visualize these events in PostHog, navigate to your [PostHog project](https://us.i.posthog.com/project/2) and create an **"Analytics basics"** dashboard with insights like:

1. **Purchase conversion funnel** — `buy_followers_cta_clicked` → `package_selected` → `purchase_completed`
2. **Purchases over time** — Trend of `purchase_completed` events
3. **Feed engagement** — Trend of `post_liked` events
4. **Social engagement** — Trend of `follow_back_clicked` events
5. **All events overview** — Breakdown table of all tracked events

You can also view live events in the [Activity tab](https://us.i.posthog.com/project/2/activity/explore) after your first interactions with the app.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
