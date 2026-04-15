<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CountryExplorer React Router v7 (Framework mode) application. Here is a summary of every change made:

- **`app/entry.client.tsx`** — Initialised `posthog-js` with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, and wrapped `<HydratedRouter>` in `<PostHogProvider>`. The `__add_tracing_headers` option is set so session and distinct IDs are automatically forwarded to server-side requests.
- **`app/lib/posthog-middleware.ts`** _(new file)_ — Server-side PostHog middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers set by the client SDK, and makes the client available on `context.posthog` via `withContext()` for proper user/session correlation.
- **`app/root.tsx`** — Registered `posthogMiddleware` in the root `middleware` export; added `posthog.captureException(error)` in `ErrorBoundary` to capture all unhandled React Router errors.
- **`react-router.config.ts`** — Enabled `future: { v8_middleware: true }` to activate middleware support.
- **`vite.config.ts`** — Added `ssr.noExternal: ['posthog-js', '@posthog/react']` so PostHog packages are bundled correctly for SSR.
- **`.env`** — Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired on successful signup; PostHog `identify()` called with user ID and username | `app/routes/signup.tsx` |
| `user_logged_in` | Fired on successful login; PostHog `identify()` called with username | `app/routes/login.tsx` |
| `user_logged_out` | Fired when the logout button is clicked; PostHog `reset()` called to clear identity | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country; includes `country_name` and `region` | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country; includes `country_name` and `region` | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user virtually visits a country; includes `country_name` and `region` | `app/routes/countries.tsx` |
| `country_detail_viewed` | Fired when a country detail page loads; includes `country_name` and `region` | `app/routes/country.tsx` |
| `explore_now_clicked` | Fired when the "Explore Now" CTA on the home page is clicked | `app/routes/home.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog at https://us.i.posthog.com/project/2/dashboard with the following five insights:

1. **Signup & Login volume** — Trend of `user_signed_up` and `user_logged_in` over time. Shows new-user acquisition vs. returning-user engagement side by side.

2. **Signup → Login conversion funnel** — Funnel with steps: `user_signed_up` → `user_logged_in`. Reveals drop-off between registration and first return login.

3. **Country engagement breakdown** — Stacked bar or pie chart with `country_claimed`, `country_liked`, and `country_visited` event counts. Shows which actions drive the most engagement.

4. **Top claimed countries** — Table insight on `country_claimed`, grouped by `country_name` property. Reveals which countries are most popular.

5. **Explore Now → Country claim funnel** — Funnel with steps: `explore_now_clicked` → `country_detail_viewed` → `country_claimed`. Tracks the full conversion path from home page CTA to claiming a country.

You can start building these at: https://us.i.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
