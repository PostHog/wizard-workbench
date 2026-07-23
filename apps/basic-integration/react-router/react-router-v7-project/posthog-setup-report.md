<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CountryExplorer React Router v7 (Framework mode) application. The integration includes client-side event capture via `posthog-js` and `@posthog/react`, server-side event capture via `posthog-node` middleware, user identification on login/signup/page-refresh, `posthog.reset()` on logout, and exception capture in the root error boundary.

## Changes made

| File | Change |
|------|--------|
| `vite.config.ts` | Added SSR externals for `posthog-js` and `@posthog/react`; added `/ingest` reverse proxy |
| `react-router.config.ts` | Enabled `v8_middleware` future flag |
| `app/lib/posthog-middleware.ts` | New file: server-side PostHog middleware using `posthog-node` |
| `app/entry.client.tsx` | Initialized `posthog-js` with `PostHogProvider` wrapping the app |
| `app/root.tsx` | Registered PostHog middleware; added `captureException` in `ErrorBoundary` |
| `app/context/AuthContext.tsx` | Added `posthog.identify()` on page load for returning authenticated users |
| `app/routes/login.tsx` | Added `posthog.identify()` and `user_logged_in` capture on successful login |
| `app/routes/signup.tsx` | Added `posthog.identify()` and `user_signed_up` capture on successful signup |
| `app/routes/profile.tsx` | Added `user_logged_out` capture and `posthog.reset()` on logout |
| `app/routes/countries.tsx` | Added captures for country actions and country search/filter |
| `app/routes/country.tsx` | Added `country_detail_viewed` capture on country detail page |
| `.env` | Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event name | Description | File |
|------------|-------------|------|
| `user_signed_up` | A new user completed the signup form and created an account. | `app/routes/signup.tsx` |
| `user_logged_in` | A user submitted the login form and successfully authenticated. | `app/routes/login.tsx` |
| `user_logged_out` | A user clicked the logout button and ended their session. | `app/routes/profile.tsx` |
| `country_claimed` | A user claimed ownership of a country on the countries listing page. | `app/routes/countries.tsx` |
| `country_liked` | A user liked a country on the countries listing page. | `app/routes/countries.tsx` |
| `country_visited` | A user marked a country as visited on the countries listing page. | `app/routes/countries.tsx` |
| `country_searched` | A user typed in the search field to filter countries by name. | `app/routes/countries.tsx` |
| `country_region_filtered` | A user selected a region filter to narrow down the countries list. | `app/routes/countries.tsx` |
| `country_detail_viewed` | A user navigated to a country's detail page to view its information. | `app/routes/country.tsx` |
| `achievement_unlocked` | A user unlocked a new achievement by reaching a milestone. | `app/routes/countries.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboards/1897528)
- [Signup & Login funnel (wizard)](https://us.i.posthog.com/project/483112/insights/gdZmQulX)
- [Country engagement actions (wizard)](https://us.i.posthog.com/project/483112/insights/P4LLIpbc)
- [New user signups (wizard)](https://us.i.posthog.com/project/483112/insights/vVzbATST)
- [Country actions by region (wizard)](https://us.i.posthog.com/project/483112/insights/cBrPVtgw)
- [Achievements unlocked (wizard)](https://us.i.posthog.com/project/483112/insights/NHe5mYR4)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
