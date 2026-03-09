<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 Framework mode application (CountryExplorer). The integration covers client-side initialization, server-side middleware, user identification, product analytics event tracking, and error capture.

## Summary of changes

- **`app/entry.client.tsx`**: Initialized `posthog-js` with the project API key and host from environment variables. Wrapped `HydratedRouter` in `PostHogProvider` to make the PostHog client available via `usePostHog()` throughout the app. Enabled `__add_tracing_headers` to automatically correlate client/server sessions.
- **`app/lib/posthog-middleware.ts`** _(new file)_: Created a server-side PostHog middleware using `posthog-node`. For each request, it creates a PostHog Node client, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (set automatically by the client SDK), and makes the client available via `context.posthog`. Uses `withContext()` for session correlation.
- **`app/root.tsx`**: Registered the PostHog middleware in the root route's middleware array. Added `usePostHog()` to the `ErrorBoundary` component to call `captureException()` on all unhandled React Router errors.
- **`react-router.config.ts`**: Enabled the `v8_middleware` future flag required for the middleware API.
- **`vite.config.ts`**: Added `ssr.noExternal` for `posthog-js` and `@posthog/react` (required for SSR), an ingest proxy for `/ingest`, and loaded env for the proxy target.
- **`app/routes/login.tsx`**: Added `posthog.identify()` on successful login to associate the user's session with their username. Captures `user_logged_in` on success and `user_login_failed` on failure.
- **`app/routes/signup.tsx`**: Added `posthog.identify()` with user ID and properties on signup. Captures `user_signed_up`. Captures exceptions in the catch block.
- **`app/routes/profile.tsx`**: Added logout handler that captures `user_logged_out` and calls `posthog.reset()` to clear the session.
- **`app/routes/countries.tsx`**: Captures `country_claimed`, `country_liked`, `country_visited` (with country and region properties) on the respective button clicks. Captures `countries_searched` when the search text or region filter changes.
- **`app/routes/country.tsx`**: Captures `country_details_viewed` (with country, region, population) on component mount via `useEffect`.
- **`app/routes/home.tsx`**: Captures `explore_now_clicked` on the primary CTA button click (top of conversion funnel).
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged into their account | `app/routes/login.tsx` |
| `user_login_failed` | User login attempt failed | `app/routes/login.tsx` |
| `user_logged_out` | User logged out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited, earning 50 points | `app/routes/countries.tsx` |
| `country_details_viewed` | User viewed the details page for a specific country | `app/routes/country.tsx` |
| `countries_searched` | User searched or filtered the countries list | `app/routes/countries.tsx` |
| `explore_now_clicked` | User clicked the Explore Now CTA on the home page | `app/routes/home.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

1. **User Acquisition Trend** — Trend of `user_signed_up` over time. Shows new user growth.
2. **Login/Signup Conversion Funnel** — Funnel: `explore_now_clicked` → `user_signed_up` or `user_logged_in`. Shows top-of-funnel conversion.
3. **Country Engagement Funnel** — Funnel: `country_details_viewed` → `country_claimed`. Shows how many users who explore a country go on to claim it.
4. **Churn Signal: Logouts** — Trend of `user_logged_out` over time. A spike may indicate friction or dissatisfaction.
5. **Top Country Interactions** — Breakdown of `country_claimed`, `country_liked`, `country_visited` by `country` property. Shows which countries are most popular.

Log in to your [PostHog project](https://us.i.posthog.com/project/2) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
