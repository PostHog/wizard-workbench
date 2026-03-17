<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Country Explorer React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`**: Initialized PostHog SDK with `posthog.init()` using environment variables, enabled tracing headers for client/server session correlation, and wrapped `HydratedRouter` with `PostHogProvider`.
- **`app/root.tsx`**: Added `usePostHog` hook to the `ErrorBoundary` component to capture unhandled exceptions via `posthog.captureException(error)`.
- **`app/routes/login.tsx`**: Added `posthog.identify()` on successful login to link the PostHog session to the user, and `posthog.capture('user_logged_in')`.
- **`app/routes/signup.tsx`**: Added `posthog.identify()` on successful signup to link the session to the new user (with email), and `posthog.capture('user_signed_up')`.
- **`app/routes/profile.tsx`**: Added a `handleLogout` handler that calls `posthog.capture('user_logged_out')` and `posthog.reset()` before logging out.
- **`app/routes/countries.tsx`**: Added `posthog.capture()` calls for `country_claimed`, `country_liked`, and `country_visited` events on each respective button click, with `country` and `region` as properties.
- **`app/routes/home.tsx`**: Added `posthog.capture('explore_now_clicked')` on the "Explore Now" CTA link click.
- **`app/routes/country.tsx`**: Added a `useEffect` to capture `country_detail_viewed` when a user loads a country detail page, with `country`, `region`, and `population` as properties.
- **`vite.config.ts`**: Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured a `/ingest` proxy for the PostHog API.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

## Events tracked

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in (also identifies user) | `app/routes/login.tsx` |
| `user_logged_out` | User logs out (also resets PostHog identity) | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country as their own | `app/routes/countries.tsx` |
| `country_liked` | User likes a country | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited | `app/routes/countries.tsx` |
| `explore_now_clicked` | User clicks the Explore Now CTA on the home page | `app/routes/home.tsx` |
| `country_detail_viewed` | User views a country's detail page | `app/routes/country.tsx` |

## Next steps

Build an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **User Acquisition Funnel** — Funnel insight: `explore_now_clicked` → `user_signed_up` → `country_claimed`. Tracks how users move from landing to activation.
2. **New Signups Over Time** — Trend insight for `user_signed_up` by day. Shows user growth.
3. **Churn Signal** — Trend insight for `user_logged_out` over time. Monitor logout rate as a churn indicator.
4. **Country Engagement Breakdown** — Trends insight with `country_claimed`, `country_liked`, and `country_visited` stacked or compared. Shows which engagement actions are most popular.
5. **Top Claimed Countries** — Breakdown of `country_claimed` by the `country` property. Reveals which countries are most popular.

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
