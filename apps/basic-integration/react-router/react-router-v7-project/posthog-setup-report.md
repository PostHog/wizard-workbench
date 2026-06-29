<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) CountryExplorer project. Here is a summary of every change made:

- **`app/entry.client.tsx`** — Initialized PostHog with `posthog.init()` using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` env vars. Wrapped the app in `<PostHogProvider>` to expose PostHog via React context throughout the component tree.
- **`app/root.tsx`** — Added `usePostHog()` in the `ErrorBoundary` and called `posthog.captureException(error)` to capture unhandled React Router errors.
- **`app/routes/login.tsx`** — On successful login, calls `posthog.identify(username)` and captures `user_logged_in`.
- **`app/routes/signup.tsx`** — On successful signup, calls `posthog.identify(newUser.id, { username })` (using the stable ID) and captures `user_signed_up`.
- **`app/routes/profile.tsx`** — Added a `handleLogout` handler that captures `user_logged_out` and calls `posthog.reset()` before logging out.
- **`app/routes/countries.tsx`** — Added capture calls for `countries_searched` (on search input), `countries_filtered` (on region select), `country_claimed`, `country_liked`, and `country_visited` in their respective button handlers.
- **`app/routes/country.tsx`** — Added a `useEffect` to capture `country_viewed` when the country detail page mounts, including the country name and region.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured a dev-server reverse proxy under `/ingest` to route PostHog traffic and avoid ad blockers.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account via the signup form. | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully authenticates via the login form. | `app/routes/login.tsx` |
| `user_logged_out` | User clicks the logout button on their profile page. | `app/routes/profile.tsx` |
| `country_claimed` | User claims ownership of a country, earning 100 points. | `app/routes/countries.tsx` |
| `country_liked` | User likes a country, earning 10 points. | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited, earning 50 points. | `app/routes/countries.tsx` |
| `country_viewed` | User opens the detail page for a specific country. | `app/routes/country.tsx` |
| `countries_searched` | User types a search query to filter the countries list. | `app/routes/countries.tsx` |
| `countries_filtered` | User selects a region filter to narrow down the countries list. | `app/routes/countries.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1775155)
- [Signup to first claim funnel](https://us.posthog.com/project/483112/insights/Ggi4CPNH)
- [Country discovery to claim funnel](https://us.posthog.com/project/483112/insights/Xybbv9VG)
- [Country engagement actions over time](https://us.posthog.com/project/483112/insights/xkgxMDUb)
- [Daily active users (logins)](https://us.posthog.com/project/483112/insights/M0pFO8MI)
- [User signups and logouts over time](https://us.posthog.com/project/483112/insights/S8TLd6OO)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login/signup. If a user returns to a session already stored in localStorage, they will be on an anonymous distinct ID until they log in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
