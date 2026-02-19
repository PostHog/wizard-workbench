<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the RESTExplorer React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** — Initialised `posthog-js` with the project API key and host from environment variables, enabled tracing headers (`__add_tracing_headers`) for client-to-server correlation, and wrapped the app in `<PostHogProvider>` so all components can access the PostHog client via hooks.
- **`app/lib/posthog-middleware.ts`** *(new file)* — Server-side PostHog middleware using `posthog-node`. Creates a per-request PostHog Node client, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client, and attaches it to the request context via `withContext()` so server-side events are correlated with the correct user session.
- **`app/root.tsx`** — Registered the PostHog middleware in the root route's `middleware` export and added `posthog.captureException(error)` to the global `ErrorBoundary` for automatic error tracking.
- **`react-router.config.ts`** — Enabled `future.v8_middleware: true` to activate the React Router v7 middleware API required by the PostHog server middleware.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure correct SSR bundling, and configured a `/ingest` proxy to the PostHog host for ad-blocker-resilient event delivery.
- **`app/routes/login.tsx`** — Added `posthog.identify()` and `user_logged_in` event capture on successful login.
- **`app/routes/signup.tsx`** — Added `posthog.identify()` and `user_signed_up` event capture on successful signup, plus `captureException` on error.
- **`app/routes/profile.tsx`** — Added `user_logged_out` event capture and `posthog.reset()` on logout.
- **`app/routes/countries.tsx`** — Added `country_claimed`, `country_liked`, and `country_visited` event captures (only fires on new actions, not repeated ones).
- **`app/routes/country.tsx`** — Added `country_detail_viewed` event capture with country metadata (name, region, subregion, population).
- **`app/routes/home.tsx`** — Added `explore_now_clicked` event capture on the primary CTA button.
- **`app/components/navbar.tsx`** — Imported `usePostHog` (available for future use).

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in to their account | `app/routes/login.tsx` |
| `user_logged_out` | User logs out from their account | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country (awards 100 points) | `app/routes/countries.tsx` |
| `country_liked` | User likes a country (awards 10 points) | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited (awards 50 points) | `app/routes/countries.tsx` |
| `country_detail_viewed` | User views the detail page for a specific country | `app/routes/country.tsx` |
| `explore_now_clicked` | User clicks "Explore Now" on the home page CTA | `app/routes/home.tsx` |

## Next steps

To create an "Analytics basics" dashboard with key insights, visit your PostHog project and add the following insights:

1. **User Signups & Logins** — Trends for `user_signed_up` + `user_logged_in` (daily)
2. **Exploration to Claim Funnel** — Funnel: `explore_now_clicked` → `country_detail_viewed` → `country_claimed`
3. **Country Engagement Actions** — Trends for `country_claimed`, `country_liked`, `country_visited`
4. **User Logout Rate** — Trend for `user_logged_out` (churn signal)
5. **Daily Active Users** — Unique users per day via `user_logged_in`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
