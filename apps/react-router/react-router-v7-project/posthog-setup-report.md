<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Country Explorer React Router v7 (Framework mode) application.

## Summary of changes

- **`app/entry.client.tsx`** — Initialised PostHog (`posthog.init`) with the project token and host from environment variables. Added `PostHogProvider` wrapping `HydratedRouter` so all routes have access to the PostHog client via `usePostHog()`. Enabled `__add_tracing_headers` so client session/distinct IDs are forwarded to the server on every request.
- **`app/lib/posthog-middleware.ts`** *(new file)* — Server-side PostHog middleware using `posthog-node`. Creates a PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (set automatically by the client SDK), and uses `posthog.withContext()` so all server-side events are correlated with the correct user session.
- **`app/root.tsx`** — Exported the `middleware` array referencing `posthogMiddleware` so it runs on every route. Added `captureException` in the `ErrorBoundary` to capture unhandled errors automatically.
- **`react-router.config.ts`** — Enabled the `v8_middleware` future flag required for the middleware API.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure correct SSR bundling.
- **`.env`** — Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`app/routes/login.tsx`** — Calls `posthog.identify()` and captures `user_logged_in` on successful login.
- **`app/routes/signup.tsx`** — Calls `posthog.identify()` with user ID, username, and email, and captures `user_signed_up` on successful signup.
- **`app/routes/profile.tsx`** — Captures `user_logged_out` and calls `posthog.reset()` when the logout button is clicked.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, `country_visited` in their respective button handlers; captures `countries_filtered` when a region filter is applied.
- **`app/routes/country.tsx`** — Captures `country_detail_viewed` (top of the claim conversion funnel) when a country detail page is rendered.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a user successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in; also identifies the user | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user clicks logout; also resets PostHog identity | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country (with country name and region) | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited | `app/routes/countries.tsx` |
| `country_detail_viewed` | Fired when a user views a country detail page — top of claim funnel | `app/routes/country.tsx` |
| `countries_filtered` | Fired when a user applies a region filter on the countries list | `app/routes/countries.tsx` |

## Next steps

We've set up an "Analytics basics" dashboard for you to keep an eye on user behaviour based on the events we just instrumented. To see your data, visit:

- **Dashboard:** [Analytics basics](https://us.posthog.com/project/2/dashboard/1346453)

Suggested insights to create on this dashboard using the events above:

1. **Signup & Login trends** — Trend of `user_signed_up` and `user_logged_in` over time (daily, last 30 days)
2. **Country claim conversion funnel** — Funnel: `country_detail_viewed` → `country_claimed` (shows what % of detail-page viewers go on to claim)
3. **Country engagement breakdown** — Trends of `country_claimed`, `country_liked`, and `country_visited` stacked by event type
4. **Region filter popularity** — Breakdown of `countries_filtered` by `region` property
5. **Churn signal** — Trend of `user_logged_out` over time (weekly)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
