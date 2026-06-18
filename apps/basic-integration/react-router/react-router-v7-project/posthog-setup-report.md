<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 (Framework mode) Country Explorer application. The following changes were made:

- **`app/entry.client.tsx`** — Initialised `posthog-js` with project token and host from environment variables, configured a local reverse proxy path (`/ingest`), enabled tracing headers for client-server correlation, and wrapped the app in `PostHogProvider`.
- **`app/lib/posthog-middleware.ts`** (new) — Server-side PostHog middleware that creates a scoped `PostHog` (Node) client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers to correlate client and server events via `withContext`, then shuts down cleanly after the response.
- **`app/root.tsx`** — Exports the `middleware` array to activate the server-side middleware on all routes; adds `usePostHog().captureException(error)` to the top-level `ErrorBoundary` for automatic unhandled error tracking.
- **`app/routes/login.tsx`** — Calls `posthog.identify()` and `posthog.capture('user_logged_in')` on successful login, and `posthog.capture('user_login_failed')` on failure.
- **`app/routes/signup.tsx`** — Calls `posthog.identify()` (with `id`, `username`, `email`) and `posthog.capture('user_signed_up')` on successful signup; calls `posthog.captureException()` if the signup throws.
- **`app/routes/profile.tsx`** — Adds a `handleLogout` function that calls `posthog.capture('user_logged_out')` and `posthog.reset()` before logging out; wires the logout button to this handler.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, and `country_visited` events (each with `country` and `region` properties) in their respective button handlers; captures `countries_filtered` with the selected `region` when the region filter changes.
- **`app/routes/country.tsx`** — Captures `country_detail_viewed` (with `country`, `region`, `population`) in a `useEffect` when the country detail page first renders — this is the top of the claim/like/visit conversion funnel.
- **`vite.config.ts`** — Added PostHog reverse-proxy routes (`/ingest`, `/ingest/static`, `/ingest/array`) and `ssr.noExternal` for `posthog-js` and `@posthog/react`.
- **`react-router.config.ts`** — Enabled `future.v8_middleware: true` to activate the middleware system.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account. | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs into their account. | `app/routes/login.tsx` |
| `user_login_failed` | Fired when a login attempt fails. | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out of their account. | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country on the countries list page. | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country on the countries list page. | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited on the countries list page. | `app/routes/countries.tsx` |
| `country_detail_viewed` | Fired when a user views the detail page of a specific country. | `app/routes/country.tsx` |
| `countries_filtered` | Fired when a user filters the countries list by region. | `app/routes/countries.tsx` |

## Next steps

Create an "Analytics basics (wizard)" dashboard at:

- [New Dashboard](https://us.posthog.com/project/2/dashboard) — create a dashboard named **"Analytics basics (wizard)"** and add these insights:
  1. **Signup & Login funnel** — funnel from `user_signed_up` → `country_detail_viewed` → `country_claimed`
  2. **User signups over time** — trend of `user_signed_up` events
  3. **Country engagement** — trend of `country_claimed`, `country_liked`, and `country_visited` overlaid on one chart
  4. **Top claimed countries** — trend of `country_claimed` broken down by `country` property
  5. **Region filter usage** — trend of `countries_filtered` broken down by `region` property

- [New Insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login/signup. Consider calling `posthog.identify(user.id)` in `AuthContext` when a stored session is restored from `localStorage`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
