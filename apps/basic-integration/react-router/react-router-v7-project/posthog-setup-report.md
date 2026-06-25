<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 (Framework mode) country explorer application. PostHog is initialized client-side in `entry.client.tsx` with the `PostHogProvider` wrapping the hydrated router, providing analytics context to all routes. A reverse-proxy is configured in `vite.config.ts` to route PostHog ingestion through `/ingest`, improving ad-blocker resilience. Error tracking is wired into the `ErrorBoundary` in `root.tsx`. User identification fires on login and signup. Ten business events are captured across six route files covering the full user journey from sign-up through country engagement.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logs in to their account | `app/routes/login.tsx` |
| `user_logged_out` | User clicks the logout button on the profile page | `app/routes/profile.tsx` |
| `country_claimed` | User claims ownership of a country | `app/routes/countries.tsx` |
| `country_liked` | User likes a country | `app/routes/countries.tsx` |
| `country_visited` | User marks a country as visited | `app/routes/countries.tsx` |
| `country_searched` | User types a search query in the countries search input | `app/routes/countries.tsx` |
| `region_filtered` | User applies a region filter to the countries list | `app/routes/countries.tsx` |
| `country_detail_viewed` | User views the detail page for a specific country | `app/routes/country.tsx` |
| `stats_viewed` | User views their personal stats and the leaderboard | `app/routes/stats.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1761253)
- **Signup to login conversion funnel**: [View insight](https://us.i.posthog.com/project/483112/insights/2GfaEnJl)
- **Country engagement trend**: [View insight](https://us.i.posthog.com/project/483112/insights/L8tXezCM)
- **Top claimed countries**: [View insight](https://us.i.posthog.com/project/483112/insights/SsxKxp05)
- **Most searched regions**: [View insight](https://us.i.posthog.com/project/483112/insights/l6gzzu5Q)
- **User retention (returning logins)**: [View insight](https://us.i.posthog.com/project/483112/insights/JnQH2Nyd)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
