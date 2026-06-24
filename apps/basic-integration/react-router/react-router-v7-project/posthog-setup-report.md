<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CountryExplorer React Router v7 (Framework mode) project. The following changes were made:

- **`app/entry.client.tsx`** — Initialized `posthog-js` with the project token and `/ingest` reverse-proxy host, enabled tracing headers for client↔server correlation, and wrapped `HydratedRouter` in `PostHogProvider`.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured reverse-proxy rules for `/ingest`, `/ingest/static`, and `/ingest/array` to avoid ad-blocker interference.
- **`app/root.tsx`** — Added `posthog.captureException(error)` to the `ErrorBoundary` so unhandled React Router errors are automatically reported to PostHog.
- **`app/routes/login.tsx`** — On successful login: calls `posthog.identify()` to associate the session with the username, then captures `user_logged_in`.
- **`app/routes/signup.tsx`** — On successful signup: calls `posthog.identify()` with the new user's ID, username, and email, then captures `user_signed_up`.
- **`app/routes/profile.tsx`** — Logout button now captures `user_logged_out` and calls `posthog.reset()` to clear the session before calling `logout()`.
- **`app/routes/countries.tsx`** — Search input captures `country_searched` (with the query), region filter captures `countries_filtered` (with the selected region), and the claim/like/visit buttons capture `country_claimed`, `country_liked`, and `country_visited` respectively (each with `country` and `region` properties).
- **`app/routes/country.tsx`** — A `useEffect` fires `country_viewed` when a country detail page is loaded, capturing `country`, `region`, and `population`.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account. | `app/routes/signup.tsx` |
| `user_logged_in` | A user successfully logged in to their account. | `app/routes/login.tsx` |
| `user_logged_out` | A user clicked the logout button on their profile page. | `app/routes/profile.tsx` |
| `country_claimed` | A user claimed a country, earning 100 points. | `app/routes/countries.tsx` |
| `country_liked` | A user liked a country, earning 10 points. | `app/routes/countries.tsx` |
| `country_visited` | A user marked a country as visited, earning 50 points. | `app/routes/countries.tsx` |
| `country_searched` | A user typed in the country search box to filter results. | `app/routes/countries.tsx` |
| `countries_filtered` | A user selected a region filter to narrow down the countries list. | `app/routes/countries.tsx` |
| `country_viewed` | A user opened a country detail page to view its information. | `app/routes/country.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Dashboard — Your starter dashboard (Analytics basics)](https://us.posthog.com/project/483112/dashboard/1751155)
- [Insight — Country exploration funnel](https://us.posthog.com/project/483112/insights/9562415)
- [Insight — User signups over time](https://us.posthog.com/project/483112/insights/9562419)
- [Insight — Country engagement actions](https://us.posthog.com/project/483112/insights/9562421)
- [Insight — Most claimed countries](https://us.posthog.com/project/483112/insights/9562424)
- [Insight — User retention](https://us.posthog.com/project/483112/insights/9562428)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
