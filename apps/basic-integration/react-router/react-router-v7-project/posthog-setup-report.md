# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) country explorer application. PostHog is initialized in `app/entry.client.tsx` with `PostHogProvider` wrapping the entire client-side app. Users are identified by username on both login and signup. Nine events cover the full user journey — account creation, session management, and every core country interaction (claim, like, visit, view). Error tracking is wired into the root `ErrorBoundary`. The Vite config includes an SSR `noExternal` entry for PostHog packages and a reverse-proxy configuration for the `/ingest` path.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account via the signup form | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs into an existing account | `app/routes/login.tsx` |
| `user_logged_out` | Fired when an authenticated user clicks the Logout button on their profile | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country; includes `country_name` and `region` properties | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country; includes `country_name` and `region` properties | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited; includes `country_name` and `region` properties | `app/routes/countries.tsx` |
| `country_viewed` | Top-of-funnel event fired when a user views a country detail page; includes `country_name` and `region` | `app/routes/country.tsx` |
| `countries_region_filtered` | Fired when the user applies a region filter on the countries list; includes `region` | `app/routes/countries.tsx` |
| `leaderboard_viewed` | Top-of-funnel event fired when the user visits the stats/leaderboard page | `app/routes/stats.tsx` |

## Next steps

To create the **Analytics basics (wizard)** dashboard, open PostHog and create the following insights:

1. **Signup → Login funnel** — Funnel insight with steps `user_signed_up` → `user_logged_in`. Shows conversion between new accounts and return sessions.
2. **Country engagement breakdown** — Trends insight with three series: `country_claimed`, `country_liked`, `country_visited`. Shows which engagement type is most popular over time.
3. **Country view → claim conversion** — Funnel insight with steps `country_viewed` → `country_claimed`. Measures how many country detail views convert to a claim.
4. **Most claimed regions** — Trends insight for `country_claimed` broken down by the `region` property. Shows which regions attract the most activity.
5. **Daily active users (logins)** — Trends insight for `user_logged_in` by unique users per day. Tracks retention and session frequency.

Dashboard creation link: [Create dashboard](https://us.posthog.com/project/2/dashboard)
New insight link: [Create insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called in `login.tsx` and `signup.tsx` but a user who reloads the page while already logged in (from localStorage) will be on an anonymous distinct ID until they log in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
