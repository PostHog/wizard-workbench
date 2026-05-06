<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloutHub, a React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** (created): Initializes PostHog with `posthog-js` and wraps the app in `PostHogProvider` so all components can access PostHog via `usePostHog()`. Includes `__add_tracing_headers` for client/server correlation and a dev proxy for event capture.
- **`app/root.tsx`**: Added `usePostHog()` and `posthog?.captureException(error)` to the `ErrorBoundary` so unhandled React Router errors are automatically tracked.
- **`app/routes/buy-followers.tsx`**: Tracks package selection and purchase completion — the core conversion funnel of the app.
- **`app/components/PostCard.tsx`**: Tracks post likes and unlikes as engagement events in the feed.
- **`app/routes/profile.tsx`**: Tracks when users follow back a bot follower.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to SSR `noExternal`, and configured a local dev reverse proxy (`/ingest`) to avoid ad-blocker interference.
- **`env.d.ts`**: Added TypeScript types for `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`.env`**: Populated with the PostHog project token and host (gitignore-covered).

| Event | Description | File |
|---|---|---|
| `followers_package_selected` | User selects a follower package on the buy followers page | `app/routes/buy-followers.tsx` |
| `followers_purchase_completed` | User completes a fake follower purchase (conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a bot follower on the profile page | `app/routes/profile.tsx` |

## Next steps

We've prepared insights for you to build a dashboard to keep an eye on user behavior. Create an **"Analytics basics"** dashboard in PostHog and add these insights:

1. **Purchase funnel** — Funnel from `followers_package_selected` → `followers_purchase_completed`: [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)
2. **Follower purchases over time** — Trend of `followers_purchase_completed`: [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
3. **Post engagement trend** — Trend of `post_liked` events over time: [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
4. **Top liked posts** — `post_liked` broken down by `post_username` property: [Create breakdown insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
5. **Follower follow-backs** — Trend of `follower_followed_back` over time: [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

[Open PostHog dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
