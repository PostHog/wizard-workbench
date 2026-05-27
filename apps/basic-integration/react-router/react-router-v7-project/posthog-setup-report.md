# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) project — CountryExplorer. The following changes were made:

- **`app/entry.client.tsx`** — Initializes `posthog-js` with the project token and host from environment variables, wraps the `HydratedRouter` in `<PostHogProvider>`, and enables cross-request tracing headers (`__add_tracing_headers`) so client and server events correlate automatically.
- **`react-router.config.ts`** — Enabled the `v8_middleware` future flag, which is required for the server-side PostHog middleware to work.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured a reverse proxy so `/ingest/*` requests are routed through the local dev server to PostHog (improves ad-blocker resilience).
- **`app/lib/posthog-middleware.ts`** _(new file)_ — Server-side middleware that creates a `posthog-node` client per request, extracts the `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (automatically set by the client SDK), and calls `posthog.withContext()` so all server events are correlated with the right client session.
- **`app/root.tsx`** — Exports the `posthogMiddleware` array so it runs on every request, and adds `posthog.captureException(error)` in the global `ErrorBoundary`.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User authenticates; triggers `posthog.identify()` | `app/routes/login.tsx` |
| `user_logged_out` | User clicks Logout; triggers `posthog.reset()` | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country (earns 100 pts) | `app/routes/countries.tsx` |
| `country_liked` | User likes a country (earns 10 pts) | `app/routes/countries.tsx` |
| `country_visited` | User virtually visits a country (earns 50 pts) | `app/routes/countries.tsx` |
| `country_viewed` | User opens a country detail page | `app/routes/country.tsx` |
| `leaderboard_viewed` | User opens the stats/leaderboard page | `app/routes/stats.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Signup → Login conversion funnel** — `user_signed_up` → `user_logged_in`. Measures what fraction of new users return to log in after their first session.
2. **Country engagement funnel** — `country_viewed` → `country_claimed`. Shows how many users who view a country detail page go on to claim it.
3. **Daily active engagement** (Trends) — `country_claimed` + `country_liked` + `country_visited` over time. Tracks the core engagement loop.
4. **User retention** (Retention) — Starting event: `user_signed_up`; return event: `user_logged_in`. Measures how many new users return over the following weeks.
5. **Churn indicator** (Trends) — `user_logged_out` over time. Rising logout rates may signal dissatisfaction.

You can create this dashboard at [/dashboard](/dashboard) in your PostHog project.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
