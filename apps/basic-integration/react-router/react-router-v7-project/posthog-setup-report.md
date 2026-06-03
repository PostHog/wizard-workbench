<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 Framework mode project. Here's what was changed:

- **`app/entry.client.tsx`** — Initialized PostHog with your project token and host (from environment variables), enabled the reverse-proxy ingest path (`/ingest`), added `__add_tracing_headers` for client-to-server session correlation, and wrapped the app in `PostHogProvider`.
- **`app/lib/posthog-middleware.ts`** *(new)* — Server-side PostHog middleware that creates a `PostHog` Node client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers sent by the client SDK, and uses `withContext()` so all server-side events are correlated to the correct user session.
- **`app/root.tsx`** — Exported the `posthogMiddleware` array so it runs on every route. Added `posthog.captureException(error)` in the `ErrorBoundary` for automatic unhandled error tracking.
- **`react-router.config.ts`** — Enabled the `v8_middleware` future flag required for the middleware export to work.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured a local reverse proxy under `/ingest` so analytics events go through your own domain instead of directly to PostHog.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

### Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs into their account | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out of their account | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited, earning 50 points | `app/routes/countries.tsx` |
| `country_viewed` | Fired when a user views the detail page for a specific country — top of the claim/visit funnel | `app/routes/country.tsx` |

### User identification

- **Signup** (`app/routes/signup.tsx`): `posthog.identify(newUser.id, { username, email })` called on successful signup, linking the anonymous session to the new user's permanent ID.
- **Login** (`app/routes/login.tsx`): `posthog.identify(username, { username })` called on successful login.
- **Logout** (`app/routes/profile.tsx`): `posthog.reset()` called after capturing `user_logged_out`, clearing the session for the next anonymous visitor.

## Next steps

We were unable to create a PostHog dashboard automatically because the configured API key is missing the `dashboard:write`, `insight:write`, and `query:read` scopes. You can create the "Analytics basics" dashboard manually in PostHog — here are the recommended insights:

1. **[Signup → Login funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)** — Funnel of `user_signed_up` → `user_logged_in` to measure conversion of new signups to active sessions.
2. **[Country engagement trends](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trends chart with `country_claimed`, `country_liked`, and `country_visited` to track core engagement volume over time.
3. **[Country view → claim funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)** — Funnel of `country_viewed` → `country_claimed` to measure what fraction of country views convert to claims.
4. **[User retention](https://us.posthog.com/project/2/insights/new?insight=RETENTION)** — Retention analysis using `user_logged_in` as the cohort event to see how many users return day-over-day.
5. **[Signups over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trend of `user_signed_up` to monitor growth in new user registrations.

To add the missing scopes, go to your [PostHog personal API keys settings](https://us.posthog.com/settings/user-api-keys).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
