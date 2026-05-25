# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CountryExplorer app. The following changes were made:

- **`app/entry.client.tsx`** — Initializes `posthog-js` with the project token and host from environment variables. Wraps the React app in `PostHogProvider` so all components can access PostHog via the `usePostHog` hook. The `__add_tracing_headers` option is enabled so client session/user context is automatically forwarded to SSR requests via `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling errors. Added a dev proxy for `/ingest` routes so events are routed through the local dev server, avoiding CORS issues.
- **`react-router.config.ts`** — Enabled the `v8_middleware: true` future flag, which is required for server-side middleware support.
- **`app/lib/posthog-middleware.ts`** *(new file)* — Creates a `PostHog` Node.js client per request, reads `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` from request headers, and uses `posthog.withContext()` so all server-side events are associated with the correct client session and user.
- **`app/root.tsx`** — Registers the PostHog middleware in the `middleware` export. Updates the `ErrorBoundary` to capture unhandled errors via `posthog.captureException()`.
- **`app/routes/login.tsx`** — Calls `posthog.identify()` with the username on successful login and captures the `user_logged_in` event.
- **`app/routes/signup.tsx`** — Calls `posthog.identify()` with the new user's ID, username, and email on successful signup and captures the `user_signed_up` event. Also captures exceptions in the error handler.
- **`app/routes/profile.tsx`** — Captures `user_logged_out` and calls `posthog.reset()` before logging out to unlink the user's PostHog session.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, and `country_visited` events (each with country name, region, and population properties). Also captures `countries_searched` when a user types a search query and `countries_filtered_by_region` when a region filter is selected.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account via the signup form | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully authenticated via the login form | `app/routes/login.tsx` |
| `user_logged_out` | User clicked the logout button on their profile page | `app/routes/profile.tsx` |
| `country_claimed` | User claimed a country, earning 100 points and potentially unlocking achievements | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, earning 10 points | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited, earning 50 points | `app/routes/countries.tsx` |
| `countries_searched` | User typed a search query to find countries by name | `app/routes/countries.tsx` |
| `countries_filtered_by_region` | User selected a region filter to narrow down the country list | `app/routes/countries.tsx` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following insights:

- **Signup & Login funnel** — Funnel from `user_signed_up` → `country_claimed` to measure onboarding conversion.
- **Country engagement trends** — Trend of `country_claimed`, `country_liked`, and `country_visited` over time to track core engagement.
- **User retention** — Retention chart using `user_logged_in` as the returning action to measure DAU/WAU stickiness.
- **Search & discovery usage** — Trend of `countries_searched` and `countries_filtered_by_region` to understand discovery behavior.
- **Churn signal** — Trend of `user_logged_out` to spot churn spikes.

You can build these directly in PostHog at [/insights](/insights) and add them to a new dashboard at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
