<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloutHub, a React Router v7 Framework mode application. Here's what was set up:

- **`app/entry.client.tsx`** (new file): Initialises the PostHog JS SDK with your project token and host, wraps the React Router `HydratedRouter` with `PostHogProvider`, and enables automatic tracing headers so client sessions can be correlated with any future server-side events.
- **`app/root.tsx`**: Added `posthog.captureException()` in the `ErrorBoundary` so any unhandled React Router errors are automatically reported to PostHog error tracking.
- **`app/routes/buy-followers.tsx`**: Tracks when the buy-followers page is viewed (top of the purchase funnel), when a follower package is selected, and when a purchase is completed — with package size, bonus, price, and total follower count as properties.
- **`app/components/PostCard.tsx`**: Tracks `post_liked` whenever a user likes or unlikes a post in the feed, including the post ID, author, and whether the action was a like or unlike.
- **`app/routes/profile.tsx`**: Tracks `follower_followed_back` when a user follows back one of their bot followers, including the followed username.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to the SSR `noExternal` list so they bundle correctly in dev mode.
- **`env.d.ts`**: Added TypeScript declarations for `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`.env`**: Created with the project token and host (gitignored).

| Event | Description | File |
|---|---|---|
| `buy_followers_page_viewed` | User views the buy-followers page (top of purchase funnel) | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selects a follower package | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a follower package purchase | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a follower on the profile page | `app/routes/profile.tsx` |

## Next steps

To build a dashboard for these events, head to PostHog and create a new dashboard named **"Analytics basics (wizard)"**. Suggested insights:

1. **Purchase funnel** — a Funnel insight with steps: `buy_followers_page_viewed` → `follower_package_selected` → `followers_purchased`. Shows where users drop off in the purchase flow.
2. **Followers purchased over time** — a Trends insight for `followers_purchased`, summing `total_followers` to track acquisition volume.
3. **Post engagement** — a Trends insight for `post_liked` broken down by `liked` (true/false) to see like vs unlike ratio.
4. **Package popularity** — a Trends insight for `follower_package_selected` broken down by `package_amount` to see which package sizes are most popular.
5. **Follow-back rate** — a Trends insight for `follower_followed_back` to track social engagement on the profile page.

- [Dashboards](https://us.posthog.com/project/2/dashboard)
- [Insights](https://us.posthog.com/project/2/insights)

> **Note:** Automatic dashboard creation requires `dashboard:write` and `insight:write` API key scopes. These were not available on the current key, so the dashboard above should be created manually by following the steps above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
