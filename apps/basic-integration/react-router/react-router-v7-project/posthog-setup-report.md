<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) Country Explorer project. PostHog is now initialized client-side in `entry.client.tsx` with a `PostHogProvider` wrapping the app, and a server-side middleware in `app/lib/posthog-middleware.ts` correlates server and client sessions via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers. Eleven events have been instrumented across seven files covering the full user journey — from signup and login through country exploration, claiming, liking, and visiting. Users are identified by their unique ID on signup and by username on login, with `posthog.reset()` called on logout to clear the anonymous session. Error tracking via `captureException` was added to the global `ErrorBoundary` in `root.tsx` and to the signup error path. The Vite dev-server is also configured to proxy PostHog requests through `/ingest` to avoid ad-blocker interference.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account. | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs into their existing account. | `app/routes/login.tsx` |
| `login_failed` | Fired when a login attempt fails due to invalid credentials. | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out of their account. | `app/routes/profile.tsx` |
| `explore_clicked` | Fired when a user clicks the Explore Now button on the home page. | `app/routes/home.tsx` |
| `country_viewed` | Fired when a user views a country's detail page (top of interaction funnel). | `app/routes/country.tsx` |
| `country_claimed` | Fired when a user claims a country, earning 100 points. | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country, earning 10 points. | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited, earning 50 points. | `app/routes/countries.tsx` |
| `country_searched` | Fired when a user types in the country search box. | `app/routes/countries.tsx` |
| `countries_filtered` | Fired when a user filters the countries list by region. | `app/routes/countries.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1792591)
- [Signup & Login Funnel](https://us.posthog.com/project/483112/insights/F777Q6QA)
- [Country Engagement](https://us.posthog.com/project/483112/insights/xDL6NiAU)
- [Login Failures](https://us.posthog.com/project/483112/insights/IxTKa4uc)
- [Top Explored Countries](https://us.posthog.com/project/483112/insights/BHVjc4xC)
- [User Retention](https://us.posthog.com/project/483112/insights/vYrnROqhagent)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
