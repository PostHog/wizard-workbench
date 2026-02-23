<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 Framework mode application (CountryExplorer). Here is a summary of all changes made:

**New files created:**
- `app/lib/posthog-middleware.ts` — Server-side PostHog middleware that creates a `PostHog` Node client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers from the client SDK, and makes the client available via `context.posthog` for use in route handlers.
- `.env` — Contains `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` (already covered by `.gitignore`).

**Modified files:**
- `app/entry.client.tsx` — Initialises `posthog-js` with your API key and host, adds `__add_tracing_headers` to automatically forward session/distinct IDs to the server, and wraps `<HydratedRouter>` with `<PostHogProvider>`.
- `react-router.config.ts` — Enables the `v8_middleware` future flag required for the PostHog middleware to work.
- `vite.config.ts` — Adds `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure correct SSR bundling.
- `app/root.tsx` — Exports the `posthogMiddleware` array so it runs on every request, and calls `posthog.captureException(error)` in the `ErrorBoundary` for automatic error tracking.
- `app/routes/login.tsx` — Calls `posthog.identify()` + `posthog.capture('user_logged_in')` on successful login.
- `app/routes/signup.tsx` — Calls `posthog.identify()` + `posthog.capture('user_signed_up')` on successful signup.
- `app/components/navbar.tsx` — Adds a `handleLogout` handler that fires `posthog.capture('user_logged_out')` and `posthog.reset()` before logging out; adds a visible Logout button.
- `app/routes/countries.tsx` — Captures `country_claimed`, `country_liked`, and `country_visited` events (only on first action, with country name and region properties).
- `app/routes/country.tsx` — Captures `country_viewed` on each country detail render (country, region, subregion, population properties).
- `app/routes/home.tsx` — Captures `explore_clicked` when user clicks the "Explore Now" CTA.
- `app/routes/stats.tsx` — Captures `stats_viewed` with the user's current stats snapshot.

**Packages installed:** `posthog-js`, `@posthog/react`, `posthog-node`

---

## Tracked Events

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account; identifies the user | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in; identifies the user | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out; resets PostHog identity | `app/components/navbar.tsx` |
| `country_claimed` | Fired when a user claims a country for the first time (country, region, total_claimed) | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country for the first time (country, region) | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited for the first time (country, region) | `app/routes/countries.tsx` |
| `country_viewed` | Fired when a user opens a country detail page (country, region, subregion, population) | `app/routes/country.tsx` |
| `explore_clicked` | Fired when a user clicks the "Explore Now" CTA on the home page | `app/routes/home.tsx` |
| `stats_viewed` | Fired when an authenticated user views their stats/leaderboard page | `app/routes/stats.tsx` |

---

## Next steps

We've prepared 5 insights and a dashboard for you to monitor user behaviour. Click each link to open the pre-configured insight in PostHog, save it, then add it to a new **"Analytics basics"** dashboard:

1. **[Signup → Country Claim Funnel](https://us.posthog.com/insights/new#eyJpbnNpZ2h0IjoiRlVOTkVMUyIsImV2ZW50cyI6W3siaWQiOiJ1c2VyX3NpZ25lZF91cCIsIm5hbWUiOiJ1c2VyX3NpZ25lZF91cCIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6MH0seyJpZCI6ImNvdW50cnlfdmlld2VkIiwibmFtZSI6ImNvdW50cnlfdmlld2VkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjoxfSx7ImlkIjoiY291bnRyeV9jbGFpbWVkIiwibmFtZSI6ImNvdW50cnlfY2xhaW1lZCIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6Mn1dLCJmdW5uZWxfd2luZG93X2ludGVydmFsIjo3LCJmdW5uZWxfd2luZG93X2ludGVydmFsX3VuaXQiOiJkYXkiLCJkYXRlX2Zyb20iOiItMzBkIn0=)** — Conversion funnel: `user_signed_up` → `country_viewed` → `country_claimed`. Reveals where new users drop off before claiming their first country.

2. **[Daily Active Users (Login Trend)](https://us.posthog.com/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6InVzZXJfbG9nZ2VkX2luIiwibmFtZSI6InVzZXJfbG9nZ2VkX2luIiwidHlwZSI6ImV2ZW50cyIsIm1hdGgiOiJ0b3RhbCJ9XSwiaW50ZXJ2YWwiOiJkYXkiLCJkaXNwbGF5IjoiQWN0aW9uc0xpbmVHcmFwaCIsImRhdGVfZnJvbSI6Ii0zMGQifQ==)** — Daily `user_logged_in` trend. Core DAU metric to track product stickiness.

3. **[Country Actions Breakdown](https://us.posthog.com/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6ImNvdW50cnlfY2xhaW1lZCIsIm5hbWUiOiJjb3VudHJ5X2NsYWltZWQiLCJ0eXBlIjoiZXZlbnRzIiwibWF0aCI6InRvdGFsIn0seyJpZCI6ImNvdW50cnlfbGlrZWQiLCJuYW1lIjoiY291bnRyeV9saWtlZCIsInR5cGUiOiJldmVudHMiLCJtYXRoIjoidG90YWwifSx7ImlkIjoiY291bnRyeV92aXNpdGVkIiwibmFtZSI6ImNvdW50cnlfdmlzaXRlZCIsInR5cGUiOiJldmVudHMiLCJtYXRoIjoidG90YWwifV0sImludGVydmFsIjoiZGF5IiwiZGlzcGxheSI6IkFjdGlvbnNMaW5lR3JhcGgiLCJkYXRlX2Zyb20iOiItMzBkIn0=)** — Overlapping trend of `country_claimed`, `country_liked`, `country_visited`. Shows which engagement actions are most popular.

4. **[Home Page CTA Conversion](https://us.posthog.com/insights/new#eyJpbnNpZ2h0IjoiRlVOTkVMUyIsImV2ZW50cyI6W3siaWQiOiJleHBsb3JlX2NsaWNrZWQiLCJuYW1lIjoiZXhwbG9yZV9jbGlja2VkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjowfSx7ImlkIjoiY291bnRyeV92aWV3ZWQiLCJuYW1lIjoiY291bnRyeV92aWV3ZWQiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjF9LHsiaWQiOiJjb3VudHJ5X2NsYWltZWQiLCJuYW1lIjoiY291bnRyeV9jbGFpbWVkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjoyfV0sImZ1bm5lbF93aW5kb3dfaW50ZXJ2YWwiOjEsImZ1bm5lbF93aW5kb3dfaW50ZXJ2YWxfdW5pdCI6ImRheSIsImRhdGVfZnJvbSI6Ii0zMGQifQ==)** — Funnel: `explore_clicked` → `country_viewed` → `country_claimed`. Measures effectiveness of the hero CTA.

5. **[User Churn – Logout Rate](https://us.posthog.com/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6InVzZXJfbG9nZ2VkX291dCIsIm5hbWUiOiJ1c2VyX2xvZ2dlZF9vdXQiLCJ0eXBlIjoiZXZlbnRzIiwibWF0aCI6InVuaXF1ZV91c2VycyJ9XSwiaW50ZXJ2YWwiOiJkYXkiLCJkaXNwbGF5IjoiQWN0aW9uc0xpbmVHcmFwaCIsImRhdGVfZnJvbSI6Ii0zMGQifQ==)** — Daily unique users triggering `user_logged_out`. An early churn signal to watch alongside the login trend.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
