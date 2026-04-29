<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CountryExplorer React Router v7 (Framework mode) application.

## Summary of changes

- **`app/entry.client.tsx`** — Initialized PostHog with `posthog-js`, wrapped the `HydratedRouter` in `PostHogProvider`, and enabled tracing headers for client-server correlation.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured dev proxy routes under `/ingest/*` to forward events to PostHog.
- **`react-router.config.ts`** — Enabled the `v8_middleware` future flag required for server-side PostHog middleware.
- **`app/lib/posthog-middleware.ts`** — Created server-side PostHog middleware that creates a `posthog-node` client per request, extracts session/distinct-ID headers (automatically injected by the client SDK), and uses `withContext()` to correlate client and server events.
- **`app/root.tsx`** — Registered the PostHog middleware, and added `captureException()` in `ErrorBoundary` for automatic error tracking on unhandled route errors.
- **`app/routes/login.tsx`** — Added `posthog.identify()` and `posthog.capture('user_logged_in')` on successful login.
- **`app/routes/signup.tsx`** — Added `posthog.identify()` and `posthog.capture('user_signed_up')` on successful signup.
- **`app/routes/profile.tsx`** — Added `posthog.capture('user_logged_out')` and `posthog.reset()` on logout.
- **`app/routes/countries.tsx`** — Added `posthog.capture('country_claimed')`, `posthog.capture('country_liked')`, `posthog.capture('country_visited')`, and `posthog.capture('country_searched')` in the respective action handlers.
- **`app/routes/country.tsx`** — Added `posthog.capture('country_detail_viewed')` via `useEffect` on mount (top of the claim conversion funnel).
- **`app/routes/home.tsx`** — Added `posthog.capture('explore_now_clicked')` on the "Explore Now" CTA.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a user successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out from their profile | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country (includes `country_name`, `region`) | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country (includes `country_name`, `region`) | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited (includes `country_name`, `region`) | `app/routes/countries.tsx` |
| `country_searched` | Fired when a user types in the country search input (includes `search_query`) | `app/routes/countries.tsx` |
| `country_detail_viewed` | Fired when a user views a country detail page — top of claim funnel (includes `country_name`, `region`) | `app/routes/country.tsx` |
| `explore_now_clicked` | Fired when a user clicks the "Explore Now" CTA on the home page | `app/routes/home.tsx` |

## Next steps

We've built some pre-configured insight links for you to keep an eye on user behavior, based on the events we just instrumented. Open each link in PostHog and click **Save** to add them to a dashboard:

- [Signups & Logins](https://us.posthog.com/project/2/insights/new?q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22dau%22%2C%20%22event%22%3A%20%22user_signed_up%22%2C%20%22custom_name%22%3A%20%22Sign%20Ups%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22dau%22%2C%20%22event%22%3A%20%22user_logged_in%22%2C%20%22custom_name%22%3A%20%22Logins%22%7D%5D%2C%20%22interval%22%3A%20%22day%22%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22trendsFilter%22%3A%20%7B%22display%22%3A%20%22ActionsLineGraph%22%7D%2C%20%22version%22%3A%202%7D%7D) — Daily unique users signing up and logging in
- [Country Claim Conversion Funnel](https://us.posthog.com/project/2/insights/new?q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22FunnelsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22explore_now_clicked%22%2C%20%22custom_name%22%3A%20%22Clicked%20Explore%20Now%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22country_detail_viewed%22%2C%20%22custom_name%22%3A%20%22Viewed%20Country%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22country_claimed%22%2C%20%22custom_name%22%3A%20%22Claimed%20Country%22%7D%5D%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22funnelsFilter%22%3A%20%7B%22funnelVizType%22%3A%20%22steps%22%2C%20%22funnelWindowInterval%22%3A%207%2C%20%22funnelWindowIntervalUnit%22%3A%20%22day%22%7D%7D%7D) — Funnel from Explore Now CTA → country detail → country claimed
- [Country Engagement](https://us.posthog.com/project/2/insights/new?q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22country_claimed%22%2C%20%22custom_name%22%3A%20%22Claimed%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22country_liked%22%2C%20%22custom_name%22%3A%20%22Liked%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22country_visited%22%2C%20%22custom_name%22%3A%20%22Visited%22%7D%5D%2C%20%22interval%22%3A%20%22week%22%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22trendsFilter%22%3A%20%7B%22display%22%3A%20%22ActionsLineGraph%22%7D%2C%20%22version%22%3A%202%7D%7D) — Weekly country claims, likes, and visits
- [Churn Signals](https://us.posthog.com/project/2/insights/new?q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22user_logged_out%22%2C%20%22custom_name%22%3A%20%22Logouts%22%7D%5D%2C%20%22interval%22%3A%20%22week%22%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22trendsFilter%22%3A%20%7B%22display%22%3A%20%22ActionsLineGraph%22%7D%2C%20%22version%22%3A%202%7D%7D) — Weekly user logouts as churn indicator
- [Country Search Activity](https://us.posthog.com/project/2/insights/new?q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22math%22%3A%20%22total%22%2C%20%22event%22%3A%20%22country_searched%22%2C%20%22custom_name%22%3A%20%22Searches%22%7D%5D%2C%20%22interval%22%3A%20%22day%22%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%2C%20%22trendsFilter%22%3A%20%7B%22display%22%3A%20%22ActionsLineGraph%22%7D%2C%20%22version%22%3A%202%7D%7D) — Daily country search queries

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
