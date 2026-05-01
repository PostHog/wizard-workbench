<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 (Framework mode) project — RESTExplorer, a country-claiming social app. The integration covers client-side SDK initialization, server-side middleware, user identification, event tracking across all key user flows, and error boundary capture.

## Summary of changes

| File | Change |
|------|--------|
| `app/entry.client.tsx` | Initialized `posthog-js` with `PostHogProvider` wrapping the app; enabled tracing headers for client↔server correlation |
| `app/lib/posthog-middleware.ts` | **New file** — server-side PostHog middleware using `posthog-node`; extracts session/distinct ID from request headers and attaches the client to route context |
| `app/root.tsx` | Registered `posthogMiddleware`; added `usePostHog().captureException()` to the `ErrorBoundary` for automatic error tracking |
| `react-router.config.ts` | Enabled `v8_middleware: true` future flag (required for middleware support) |
| `vite.config.ts` | Added `ssr.noExternal` for `posthog-js` and `@posthog/react`; added reverse proxy config for `/ingest/*` routes |
| `.env` | Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` |
| `app/routes/login.tsx` | `posthog.identify()` + `user_logged_in` capture on successful login |
| `app/routes/signup.tsx` | `posthog.identify()` + `user_signed_up` capture on successful signup |
| `app/routes/profile.tsx` | `user_logged_out` capture + `posthog.reset()` on logout button click |
| `app/routes/countries.tsx` | `country_claimed`, `country_liked`, `country_visited`, `country_region_filtered`, and `achievement_unlocked` captures |
| `app/routes/home.tsx` | `explore_now_clicked` capture on the "Explore Now" CTA (top of conversion funnel) |
| `app/routes/stats.tsx` | `leaderboard_viewed` capture with user rank and point stats |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in to an existing account | `app/routes/login.tsx` |
| `user_logged_out` | User clicks the logout button from their profile | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country (earns 100 pts). Props: `country`, `region` | `app/routes/countries.tsx` |
| `country_liked` | User likes a country (earns 10 pts). Props: `country`, `region` | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited (earns 50 pts). Props: `country`, `region` | `app/routes/countries.tsx` |
| `country_region_filtered` | User filters the countries list by region. Props: `region` | `app/routes/countries.tsx` |
| `explore_now_clicked` | User clicks the "Explore Now" CTA on the home page — top of conversion funnel | `app/routes/home.tsx` |
| `achievement_unlocked` | User unlocks a new achievement. Props: `achievement_name` | `app/routes/countries.tsx` |
| `leaderboard_viewed` | Authenticated user views the stats/leaderboard page. Props: `user_rank`, `total_points`, `claimed_countries` | `app/routes/stats.tsx` |

## Next steps

We recommend building these insights and a dashboard in PostHog to keep an eye on user behavior, based on the events instrumented:

1. **Conversion funnel** — Track the signup funnel: `explore_now_clicked` → `user_signed_up` → `country_claimed`
   [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Engagement trends** — Trend of `country_claimed`, `country_liked`, and `country_visited` over time
   [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **New signups over time** — Daily/weekly `user_signed_up` events as a growth metric
   [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Achievement unlock rate** — `achievement_unlocked` events broken down by `achievement_name`
   [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Churn signal** — `user_logged_out` trend over time — a spike may indicate disengagement
   [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

[Create a new "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
