<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the RESTExplorer React Router v7 project. The following changes were made:

**Packages installed:** `posthog-js`, `@posthog/react`, `posthog-node`

**Infrastructure changes:**
- `app/entry.client.tsx` — PostHog initialized with `PostHogProvider` wrapping the app; tracing headers enabled to correlate client/server events
- `app/lib/posthog-middleware.ts` — Created server-side PostHog middleware that extracts session/distinct IDs from request headers and creates a per-request PostHog Node client
- `app/root.tsx` — Middleware registered; `ErrorBoundary` now captures all unhandled exceptions via `posthog.captureException()`
- `react-router.config.ts` — Enabled `v8_middleware` future flag required for middleware support
- `vite.config.ts` — Added `ssr.noExternal` to bundle `posthog-js` and `@posthog/react` for SSR
- `.env` — `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables configured

**Event instrumentation:**

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in | `app/routes/login.tsx` |
| `user_logged_out` | Fired when the user clicks the logout button; PostHog identity is reset | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country for the first time (100 pts). Core engagement action. | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country for the first time (10 pts) | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited for the first time (50 pts) | `app/routes/countries.tsx` |
| `country_detail_viewed` | Fired when a user views a country detail page — top of engagement funnel | `app/routes/country.tsx` |
| `countries_searched` | Fired when the user types a search query in the countries list | `app/routes/countries.tsx` |
| `countries_region_filtered` | Fired when the user selects a region filter on the countries list | `app/routes/countries.tsx` |
| `leaderboard_viewed` | Fired when an authenticated user views the stats/leaderboard page | `app/routes/stats.tsx` |
| `achievement_unlocked` | Fired when a user unlocks a new achievement (First Claim, Country Collector, etc.) | `app/lib/utils/auth.ts` |

**User identification:** Users are identified on login (`app/routes/login.tsx`) and signup (`app/routes/signup.tsx`) using `posthog.identify()` with their username and email as properties.

## Next steps

To complete the analytics dashboard setup, create an **"Analytics basics"** dashboard in PostHog with the following recommended insights:

1. **User Acquisition Funnel** — Funnel: `user_signed_up` → `country_detail_viewed` → `country_claimed`
2. **Daily Active Engagement** — Trend: `country_claimed` + `country_liked` + `country_visited` over time
3. **Country Exploration Engagement** — Breakdown of `country_detail_viewed` by `region` property
4. **Achievement Unlocks** — Trend of `achievement_unlocked` broken down by `achievement` property
5. **Search & Filter Usage** — Trend: `countries_searched` + `countries_region_filtered` (indicates discovery behavior)

Visit your [PostHog project](https://us.i.posthog.com/project/2) to create these insights and monitor user behavior.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
