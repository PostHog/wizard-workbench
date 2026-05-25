<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Country Explorer app (React Router v7 Framework mode). The integration covers client-side event tracking, user identification, error tracking, and a server-side middleware for SSR correlation.

## What was changed

- **`app/entry.client.tsx`** — Initializes `posthog-js`, adds `__add_tracing_headers` for client-server session correlation, and wraps the app in `PostHogProvider`.
- **`vite.config.ts`** — Adds `ssr.noExternal` for PostHog packages to prevent SSR errors, and a reverse-proxy config for `/ingest/*` routes.
- **`react-router.config.ts`** — Enables the `v8_middleware` future flag required for server-side middleware.
- **`app/lib/posthog-middleware.ts`** *(new)* — Server-side PostHog middleware that creates a `PostHog` Node client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and properly shuts down after each request.
- **`app/root.tsx`** — Registers the PostHog middleware and adds `captureException` to the `ErrorBoundary` for automatic error tracking.
- **`app/routes/login.tsx`** — Identifies the user and captures `user_logged_in` on successful login.
- **`app/routes/signup.tsx`** — Identifies the user and captures `user_signed_up` on successful signup; captures exceptions on signup failure.
- **`app/routes/profile.tsx`** — Captures `user_logged_out` and calls `posthog.reset()` when the user logs out.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, `country_visited`, `country_searched`, and `country_filtered_by_region` with relevant properties.
- **`app/routes/country.tsx`** — Captures `country_viewed` once on mount via `useEffect` with country name, region, and population.
- **`app/routes/home.tsx`** — Captures `explore_now_clicked` on the primary CTA link.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs into their account | `app/routes/login.tsx` |
| `user_logged_out` | User clicks the logout button | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country (core conversion, +100 pts) | `app/routes/countries.tsx` |
| `country_liked` | User likes a country (+10 pts) | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited (+50 pts) | `app/routes/countries.tsx` |
| `country_viewed` | User opens a country detail page (funnel top) | `app/routes/country.tsx` |
| `country_searched` | User types in the country search box | `app/routes/countries.tsx` |
| `country_filtered_by_region` | User selects a region filter | `app/routes/countries.tsx` |
| `explore_now_clicked` | User clicks the Explore Now CTA on the home page | `app/routes/home.tsx` |

## Next steps

We've instrumented the key user actions. Here are the insights and dashboards to build in PostHog:

- **[Activity explorer — see your first events](/activity/explore)** — Verify events are flowing after your first user interactions.
- **[Create an "Analytics basics" dashboard](/dashboard)** — Click "New dashboard" and add the following insights:
  - **Signup to First Claim Funnel** — Funnel: `user_signed_up` → `country_claimed` — tracks the core conversion.
  - **Country Actions Over Time** — Trends: `country_claimed`, `country_liked`, `country_visited` — monitors engagement.
  - **Login vs Signup trend** — Trends: `user_logged_in`, `user_signed_up` — tracks acquisition.
  - **Country detail page views** — Trends: `country_viewed` — shows discovery behavior.
  - **Explore CTAs vs Signups** — Trends: `explore_now_clicked`, `user_signed_up` — tracks top-of-funnel effectiveness.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
