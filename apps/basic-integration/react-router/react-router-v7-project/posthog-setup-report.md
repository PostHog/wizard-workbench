<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was installed for this React Router v7 framework-mode app, initialized in the client entrypoint with environment variables, wrapped with the React provider, and connected to the existing auth flow for identify/reset behavior. Custom product analytics events were added across signup, login, home exploration, country interactions, profile usage, and stats views. Error capture was added to the root error boundary and signup failure path. A helper module was also added to keep person-property and country-action event properties consistent.

| Event name | Description | File |
| --- | --- | --- |
| signup_completed | Captures when a visitor successfully creates a fake account and starts a session. | `app/routes/signup.tsx` |
| login_completed | Captures when an existing user successfully logs into the application. | `app/routes/login.tsx` |
| logout_clicked | Captures when an authenticated user logs out from the application. | `app/routes/profile.tsx` |
| countries_explore_started | Captures when a visitor starts the main exploration flow from the home page. | `app/routes/home.tsx` |
| countries_search_updated | Captures when a user changes the country search term while browsing the catalog. | `app/routes/countries.tsx` |
| countries_region_filter_selected | Captures when a user filters countries by region. | `app/routes/countries.tsx` |
| country_claimed | Captures when a signed-in user claims a country to earn points. | `app/routes/countries.tsx` |
| country_liked | Captures when a signed-in user likes a country. | `app/routes/countries.tsx` |
| country_visited | Captures when a signed-in user marks a country as visited. | `app/routes/countries.tsx` |
| country_detail_viewed | Captures when a user opens an individual country detail page. | `app/routes/country.tsx` |
| stats_viewed | Captures when an authenticated user opens the stats and leaderboard screen. | `app/routes/stats.tsx` |
| profile_viewed | Captures when an authenticated user opens the profile page. | `app/routes/profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831087)
- [Signup to exploration funnel (wizard)](https://us.posthog.com/project/483112/insights/N9tMEcab)
- [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/zOdiAG9X)
- [Country actions by type (wizard)](https://us.posthog.com/project/483112/insights/BpXl6UUe)
- [Search and filter activity (wizard)](https://us.posthog.com/project/483112/insights/hTb5GVqe)
- [Profile and stats views (wizard)](https://us.posthog.com/project/483112/insights/v2PSqSof)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
