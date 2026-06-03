<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Country Explorer React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** — PostHog is initialized with the project token and host from environment variables, and the app is wrapped in `PostHogProvider`. The `__add_tracing_headers` option is set to propagate session and user identity to server-side requests automatically.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR errors, and configured a reverse proxy for PostHog ingestion (`/ingest`), asset (`/ingest/static`), and array (`/ingest/array`) routes.
- **`react-router.config.ts`** — Enabled the `v8_middleware` future flag to support server-side PostHog middleware.
- **`app/lib/posthog-middleware.ts`** — Created a new server-side middleware that initializes a PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` tracing headers, and associates all server-side events with the correct user session via `withContext()`.
- **`app/root.tsx`** — Registered the PostHog middleware in the middleware array and added `posthog.captureException()` to the `ErrorBoundary` for automatic unhandled error tracking.
- **`app/routes/login.tsx`** — Added `posthog.identify()` and a `logged_in` capture on successful login.
- **`app/routes/signup.tsx`** — Added `posthog.identify()`, a `signed_up` capture on successful signup, and exception capture in the error handler.
- **`app/routes/profile.tsx`** — Added a `logged_out` capture and `posthog.reset()` on logout to clear the identified user session.
- **`app/routes/countries.tsx`** — Added captures for `country_claimed`, `country_liked`, `country_visited` on the respective action buttons, and `countries_filtered` when the region filter changes.
- **`app/routes/country.tsx`** — Added a `country_detail_viewed` capture on mount for the country detail page (top of the claim conversion funnel).
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `logged_in` | User successfully logs in to their account | `app/routes/login.tsx` |
| `logged_out` | User logs out of their account | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User likes a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited (virtual), earning 50 points | `app/routes/countries.tsx` |
| `country_detail_viewed` | User views the detail page for a specific country — top of the claim funnel | `app/routes/country.tsx` |
| `countries_filtered` | User filters the countries list by region | `app/routes/countries.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Create an **"Analytics basics"** dashboard in PostHog and add these insights:

1. **Signup & Login Trends** — [Trends insight](https://us.posthog.com/project/2/insights/new) tracking `signed_up` and `logged_in` events over time
2. **Signup to First Claim Funnel** — [Funnel insight](https://us.posthog.com/project/2/insights/new) with steps: `signed_up` → `country_detail_viewed` → `country_claimed`
3. **Country Engagement** — [Trends insight](https://us.posthog.com/project/2/insights/new) showing `country_claimed`, `country_liked`, and `country_visited` side-by-side
4. **Country Discovery to Claim Funnel** — [Funnel insight](https://us.posthog.com/project/2/insights/new) with steps: `country_detail_viewed` → `country_claimed`
5. **Filter Region Breakdown** — [Trends insight](https://us.posthog.com/project/2/insights/new) of `countries_filtered` broken down by `region` property

[Create a new dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
