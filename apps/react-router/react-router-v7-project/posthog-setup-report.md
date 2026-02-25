<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode Country Explorer application. The integration includes client-side event tracking, user identification, server-side middleware for correlated tracking, and error monitoring.

## Summary of Changes

- **`vite.config.ts`** — Updated to load env vars, added `ssr.noExternal` for PostHog packages, and configured a `/ingest` proxy for PostHog's ingestion endpoint.
- **`react-router.config.ts`** — Enabled `v8_middleware: true` future flag to support the PostHog server middleware.
- **`app/entry.client.tsx`** — Initialized `posthog-js` on the client with `VITE_PUBLIC_POSTHOG_KEY`/`VITE_PUBLIC_POSTHOG_HOST`, enabled tracing headers for client–server correlation, and wrapped the router in `<PostHogProvider>`.
- **`app/lib/posthog-middleware.ts`** *(new)* — Server-side PostHog middleware using `posthog-node`. Creates a PostHog client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (automatically set by the client SDK), and sets up `withContext()` so server events are linked to the correct user session.
- **`app/root.tsx`** — Exported the `posthogMiddleware` array, imported `usePostHog`, and added `posthog.captureException(error)` in the `ErrorBoundary` for automatic error tracking.
- **`app/routes/login.tsx`** — Added `posthog.identify()` and `posthog.capture('user_logged_in')` on successful login.
- **`app/routes/signup.tsx`** — Added `posthog.identify()` with user ID and properties, and `posthog.capture('user_signed_up')` on new account creation.
- **`app/routes/profile.tsx`** — Added a `handleLogout` handler that fires `posthog.capture('user_logged_out')` and `posthog.reset()` before calling the existing `logout()`.
- **`app/routes/countries.tsx`** — Added capture for `country_claimed`, `country_liked`, `country_visited` on the respective action buttons (only fires on first claim/like); added `countries_searched` (fires after 2+ characters) and `countries_filtered_by_region` on filter change.
- **`app/routes/country.tsx`** — Added `posthog.capture('country_viewed')` with country metadata when a country detail page renders.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

## Events Instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully creates a new account via the signup form | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in (also triggers `identify()`) | `app/routes/login.tsx` |
| `user_logged_out` | User clicks Logout on their profile page (also calls `posthog.reset()`) | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country for the first time (key conversion event) | `app/routes/countries.tsx` |
| `country_liked` | User likes a country for the first time | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited | `app/routes/countries.tsx` |
| `country_viewed` | User navigates to a country detail page (top of engagement funnel) | `app/routes/country.tsx` |
| `countries_searched` | User types a search query (>2 chars) in the countries list | `app/routes/countries.tsx` |
| `countries_filtered_by_region` | User selects a region filter in the countries list | `app/routes/countries.tsx` |

## Next Steps

To explore the data captured by these events, visit your PostHog project and create insights such as:

- **Signup → View → Claim funnel** — `user_signed_up` → `country_viewed` → `country_claimed`
- **Daily Active Users** — unique users triggering `user_logged_in` per day
- **Country Engagement Trends** — `country_claimed`, `country_liked`, `country_visited` over time
- **User Retention** — cohort users by `user_signed_up`, retain by `user_logged_in`
- **Top Searched Countries** — breakdown of `countries_searched` by `query` property

[Open your PostHog project →](https://us.posthog.com/project/238460)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
