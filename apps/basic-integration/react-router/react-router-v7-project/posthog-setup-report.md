<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Country Explorer React Router v7 Framework app. PostHog is initialised client-side in `entry.client.tsx` with the `PostHogProvider` wrapping the hydrated router. The Vite config was updated with SSR `noExternal` rules and a reverse proxy for PostHog ingestion in dev. The root `ErrorBoundary` now captures unhandled exceptions via `captureException`. Seven events are tracked across five route files covering the full user lifecycle — signup, login, logout, and all three country interaction actions. Users are identified by username (plus email on signup) at the moment of authentication, and the PostHog identity is reset on logout.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account via the signup form. | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully authenticates and logs in via the login form. | `app/routes/login.tsx` |
| `user_logged_out` | User explicitly logs out from their profile page. | `app/routes/profile.tsx` |
| `country_claimed` | User claims a country on the countries list page. | `app/routes/countries.tsx` |
| `country_liked` | User likes a country on the countries list page. | `app/routes/countries.tsx` |
| `country_visited` | User virtually visits a country on the countries list page. | `app/routes/countries.tsx` |
| `country_detail_viewed` | User views the detail page for a specific country. | `app/routes/country.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics (wizard):** https://us.posthog.com/project/483112/dashboard/1787475
- Signups & Logins Over Time: https://us.posthog.com/project/483112/insights/Tq7nuEkN
- Signup → Login → Country Claimed Funnel: https://us.posthog.com/project/483112/insights/4yUFYCqU
- Country Actions Breakdown: https://us.posthog.com/project/483112/insights/GetfIqQt
- Most Viewed Countries: https://us.posthog.com/project/483112/insights/Xfqjlzfn
- User Churn: Logout Rate: https://us.posthog.com/project/483112/insights/sxLvgavY

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
