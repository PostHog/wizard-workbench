<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 (Framework mode) Country Explorer project.

## Changes made

- **`app/entry.client.tsx`** — Initialized `posthog-js` with your project token and host, and wrapped the app in `<PostHogProvider>` to make the PostHog client available across all components via `usePostHog()`. Added `__add_tracing_headers` so session and distinct IDs flow automatically to the server.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR errors, and configured a reverse-proxy for `/ingest` routes to avoid ad-blocker interference.
- **`react-router.config.ts`** — Enabled the `v8_middleware` future flag, required for server-side PostHog middleware.
- **`app/lib/posthog-middleware.ts`** *(new file)* — Server-side middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client SDK, and uses `withContext()` to correlate server and client events.
- **`app/root.tsx`** — Registered the PostHog middleware array, and added `posthog?.captureException(error)` in the `ErrorBoundary` for automatic unhandled error tracking.
- **`app/routes/signup.tsx`** — Identifies the user on signup (`posthog.identify`) and captures `user_signed_up`. Also captures exceptions on signup failure.
- **`app/routes/login.tsx`** — Identifies the user on login (`posthog.identify`) and captures `user_logged_in`.
- **`app/routes/profile.tsx`** — Captures `user_logged_out` and calls `posthog.reset()` when the logout button is clicked.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, `country_visited`, `country_searched`, `country_filtered_by_region`, and `achievement_unlocked` (detected by diffing achievements before/after each action).
- **`app/routes/country.tsx`** — Captures `country_detail_viewed` on mount, marking the top of the claim conversion funnel.
- **`app/routes/home.tsx`** — Captures `explore_now_clicked` on the hero CTA.

## Tracked events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully signs up | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when an existing user successfully logs in | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user clicks the Logout button | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country (includes `country_name`, `region`) | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country (includes `country_name`, `region`) | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited (includes `country_name`, `region`) | `app/routes/countries.tsx` |
| `country_searched` | Fired when the user types in the search box (includes `search_query`) | `app/routes/countries.tsx` |
| `country_filtered_by_region` | Fired when the user selects a region filter (includes `region`) | `app/routes/countries.tsx` |
| `country_detail_viewed` | Fired when a user views a country detail page — top of claim funnel (includes `country_name`, `region`) | `app/routes/country.tsx` |
| `achievement_unlocked` | Fired when a user earns a new achievement (includes `achievement_name`, `total_achievements`) | `app/routes/countries.tsx` |
| `explore_now_clicked` | Fired when the user clicks the hero CTA on the home page | `app/routes/home.tsx` |

## Next steps

With these events in place, here are some dashboards and funnels to build in PostHog:

- **Country claim funnel**: `country_detail_viewed` → `country_claimed` — shows drop-off between viewing and claiming a country.
- **Sign-up conversion**: `explore_now_clicked` → `user_signed_up` → `country_claimed` — tracks the full new-user journey.
- **Engagement trends**: Trend charts for `country_claimed`, `country_liked`, `country_visited` over time — shows active user engagement.
- **Retention**: Returning users who fire `user_logged_in` multiple times — measures stickiness.
- **Achievement rate**: `achievement_unlocked` as a ratio of `country_claimed` — shows how engaging the gamification is.

You can create an "Analytics basics" dashboard in [PostHog](/dashboard) with the insights above using the event names listed in the table.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
