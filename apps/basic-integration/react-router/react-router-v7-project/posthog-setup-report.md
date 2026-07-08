# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 (Framework mode) project. The following changes were made:

- **`app/entry.client.tsx`** — Initialized `posthog-js` with env vars and wrapped `HydratedRouter` in `PostHogProvider`. The `__add_tracing_headers` option is set so session and distinct IDs flow automatically to any future server-side requests.
- **`app/root.tsx`** — Added `usePostHog()` to the `ErrorBoundary` component to capture unhandled errors via `captureException`.
- **`app/routes/login.tsx`** — Added `posthog.identify()` (using the user's stable ID) and `posthog.capture('user_logged_in')` on successful login.
- **`app/routes/signup.tsx`** — Added `posthog.identify()` and `posthog.capture('user_signed_up')` on successful signup.
- **`app/routes/profile.tsx`** — Added `posthog.capture('user_logged_out')` and `posthog.reset()` in a `handleLogout` handler wired to the Logout button.
- **`app/routes/countries.tsx`** — Added `posthog.capture()` calls for `country_claimed`, `country_liked`, and `country_visited` in the respective button click handlers, with `country_name` and `country_region` properties.
- **`app/routes/country.tsx`** — Added `posthog.capture('country_viewed')` in a `useEffect` on mount (funnel top for the country claim conversion flow).
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, plus a reverse proxy configuration for PostHog ingestion (`/ingest/*`).
- **`.env`** — Populated `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

## Events

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account via the signup form. | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in with an existing account. | `app/routes/login.tsx` |
| `user_logged_out` | User clicks the logout button and ends their session. | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country, earning 100 points. | `app/routes/countries.tsx` |
| `country_liked` | User likes a country, earning 10 points. | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as virtually visited, earning 50 points. | `app/routes/countries.tsx` |
| `country_viewed` | User opens the detail page for a specific country (top of the claim funnel). | `app/routes/country.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818303)
- [Country claim funnel (wizard)](https://us.posthog.com/project/483112/insights/ywAdlo1h) — Conversion funnel: `country_viewed` → `country_claimed`
- [Signups & logins over time (wizard)](https://us.posthog.com/project/483112/insights/mSwLpESY) — Daily signups vs logins trend
- [Country engagement actions (wizard)](https://us.posthog.com/project/483112/insights/aiSJsu6J) — Claims, likes, and visits per day
- [Claims by region (wizard)](https://us.posthog.com/project/483112/insights/T6WaBoqb) — Countries claimed broken down by world region
- [User churn — logouts over time (wizard)](https://us.posthog.com/project/483112/insights/vRKcYdO6) — New users vs logouts as a churn signal

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login/signup. If a user returns with an active session (page refresh), their events will be on an anonymous distinct ID until they log in again. Consider calling `posthog.identify()` in `AuthContext` when a session is restored from localStorage on mount.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
