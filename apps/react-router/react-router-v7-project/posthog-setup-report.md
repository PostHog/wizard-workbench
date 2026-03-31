<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the RESTExplorer React Router v7 (Framework mode) application. Here's a summary of all changes made:

## Changes summary

- **`app/entry.client.tsx`** — Initialized PostHog with `posthog-js` and wrapped the app in `PostHogProvider`. Added `__add_tracing_headers` to correlate client and server sessions.
- **`app/lib/posthog-middleware.ts`** *(new file)* — Created server-side PostHog middleware using `posthog-node`. Extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from requests, sets a PostHog client on the request context, and shuts it down after each request.
- **`app/root.tsx`** — Registered `posthogMiddleware` as a route middleware, and added `captureException` to the `ErrorBoundary` for automatic error tracking.
- **`react-router.config.ts`** — Enabled `v8_middleware` future flag required for middleware support.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, plus reverse proxy config for PostHog asset/API requests.
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`app/routes/login.tsx`** — Identifies users and captures `user_logged_in` on success; captures `login_failed` on failure.
- **`app/routes/signup.tsx`** — Identifies users and captures `user_signed_up` on successful account creation.
- **`app/routes/profile.tsx`** — Captures `user_logged_out` and resets PostHog identity when the user logs out.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, `country_visited`, `country_searched`, and `country_filtered_by_region` events.
- **`app/routes/home.tsx`** — Captures `explore_now_clicked` when the user clicks the main CTA.

## Events tracked

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs into their account | `app/routes/login.tsx` |
| `login_failed` | Fired when a login attempt fails | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out of their account | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country (includes country name and region) | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country (includes country name and region) | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited (includes country name and region) | `app/routes/countries.tsx` |
| `country_searched` | Fired when a user searches for a country by name (after 3+ chars) | `app/routes/countries.tsx` |
| `country_filtered_by_region` | Fired when a user filters countries by region | `app/routes/countries.tsx` |
| `explore_now_clicked` | Fired when a user clicks the "Explore Now" CTA on the home page | `app/routes/home.tsx` |

## Next steps

We recommend building a dashboard in PostHog to keep an eye on user behavior using the events just instrumented. Here are some suggested insights:

1. **Signup & Login Conversion Funnel** — `explore_now_clicked` → `user_signed_up` / `user_logged_in`
2. **Daily Signups Trend** — Track `user_signed_up` over time to monitor growth
3. **Country Engagement** — `country_claimed`, `country_liked`, and `country_visited` side by side
4. **Login Failure Rate** — Monitor `login_failed` alongside `user_logged_in`
5. **User Churn** — Track `user_logged_out` events over time

You can build these in your PostHog project:
- **PostHog Project**: https://us.posthog.com/project/238460
- **New Dashboard**: https://us.posthog.com/project/238460/dashboard
- **New Insight**: https://us.posthog.com/project/238460/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
