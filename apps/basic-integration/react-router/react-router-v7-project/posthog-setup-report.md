<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the RESTExplorer React Router v7 (Framework mode) application.

## Summary of changes

- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured a reverse proxy for PostHog ingestion at `/ingest`.
- **`react-router.config.ts`** — Enabled the `v8_middleware` future flag required for server-side PostHog middleware.
- **`app/entry.client.tsx`** — Initialized the PostHog client and wrapped the app in `PostHogProvider`, enabling the `usePostHog` hook throughout the app. Enabled `__add_tracing_headers` for client–server session correlation.
- **`app/lib/posthog-middleware.ts`** *(new file)* — Server-side PostHog middleware that initializes a `posthog-node` client per request, extracts the `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers, and calls `posthog.withContext()` to correlate server events with the correct user and session.
- **`app/root.tsx`** — Registered the PostHog middleware and added `posthog.captureException()` to the `ErrorBoundary` for automatic error tracking.
- **`app/routes/login.tsx`** — Added `posthog.identify()` + `user_logged_in` on successful login, and `login_failed` on failed attempts.
- **`app/routes/signup.tsx`** — Added `posthog.identify()` + `user_signed_up` on successful registration; captures exception on error.
- **`app/routes/countries.tsx`** — Added `country_claimed`, `country_liked`, and `country_visited` event capture with `country` and `region` properties.
- **`app/routes/country.tsx`** — Added `country_viewed` event (top of claim funnel) via `useEffect` on mount.
- **`app/routes/profile.tsx`** — Added `user_logged_out` capture and `posthog.reset()` on logout.
- **`app/routes/home.tsx`** — Added `explore_cta_clicked` capture on the homepage "Explore Now" CTA.
- **`.env`** — Set `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in to an existing account | `app/routes/login.tsx` |
| `login_failed` | User attempted to log in but credentials were not found | `app/routes/login.tsx` |
| `user_logged_out` | User clicks the logout button from their profile page | `app/routes/profile.tsx` |
| `country_viewed` | User views a country detail page (top of claim funnel) | `app/routes/country.tsx` |
| `country_claimed` | User claims a country on the countries list | `app/routes/countries.tsx` |
| `country_liked` | User likes a country on the countries list | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited on the countries list | `app/routes/countries.tsx` |
| `explore_cta_clicked` | User clicks the Explore Now CTA on the homepage | `app/routes/home.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Signup & Login funnel** — Funnel from `explore_cta_clicked` → `user_signed_up` → `country_claimed` to measure conversion from homepage to first action.
2. **Daily active users** — Trend of unique users triggering any event per day.
3. **Country engagement breakdown** — Breakdown of `country_claimed` + `country_liked` + `country_visited` by `country` property to see which countries are most popular.
4. **Login failure rate** — Trend of `login_failed` events to monitor authentication issues.
5. **Top claimed regions** — Breakdown of `country_claimed` by `region` property to see geographic engagement patterns.

Create these in your PostHog project:
- **New dashboard**: https://us.posthog.com/project/2/dashboard
- **New insight**: https://us.posthog.com/project/2/insights/new
- **Activity feed** (to verify events are arriving): https://us.posthog.com/project/2/activity/explore

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
