<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 (Framework mode) CountryExplorer project.

## What was added

- **`app/entry.client.tsx`** — PostHog is initialized with `posthog-js` and the app is wrapped in `<PostHogProvider>`. A reverse-proxy path (`/ingest`) is configured so analytics traffic routes through your own domain.
- **`app/lib/posthog-middleware.ts`** — A server-side PostHog middleware creates a per-request PostHog Node client, extracts the `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers set automatically by the client SDK, and makes the client available to route actions via `context.posthog`.
- **`app/root.tsx`** — The `posthogMiddleware` is registered on the root route so every request gets a server-side PostHog client. The `ErrorBoundary` now calls `posthog.captureException()` to capture unhandled React Router errors.
- **`vite.config.ts`** — Added SSR `noExternal` entries for `posthog-js` and `@posthog/react`, and configured the Vite dev-server proxy (`/ingest`, `/ingest/static`, `/ingest/array`) to route PostHog traffic through your own domain.
- **`react-router.config.ts`** — Enabled the `v8_middleware` future flag required for React Router middleware.
- **`.env`** — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are set with your project credentials.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account via the signup form | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in via the login form | `app/routes/login.tsx` |
| `user_logged_out` | User logs out from their profile page | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country, earning 100 points | `app/routes/countries.tsx` |
| `country_liked` | User likes a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited (virtual), earning 50 points | `app/routes/countries.tsx` |

## User identification

- `posthog.identify(username)` is called on successful **login** (`app/routes/login.tsx`).
- `posthog.identify(username, { email, username })` is called on successful **signup** (`app/routes/signup.tsx`).
- `posthog.reset()` is called on **logout** to clear the identity (`app/routes/profile.tsx`).
- Tracing headers (`__add_tracing_headers`) are enabled so client session context is automatically forwarded to server-side events.

## Next steps

Build insights and a dashboard in PostHog to keep an eye on user behavior:

- [New trends insight — Signups over time](/insights/new?insight=TRENDS) — plot `user_signed_up` over the last 30 days
- [New trends insight — Logins over time](/insights/new?insight=TRENDS) — plot `user_logged_in` over the last 30 days
- [New trends insight — Country engagement](/insights/new?insight=TRENDS) — plot `country_claimed`, `country_liked`, and `country_visited` on one chart
- [New funnel insight — Signup to first claim](/insights/new?insight=FUNNELS) — funnel from `user_signed_up` → `country_claimed`
- [New trends insight — Churn (logouts)](/insights/new?insight=TRENDS) — plot `user_logged_out` and compare it to `user_logged_in`
- [Dashboards](/dashboards) — create an "Analytics basics" dashboard and pin the above insights to it

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
