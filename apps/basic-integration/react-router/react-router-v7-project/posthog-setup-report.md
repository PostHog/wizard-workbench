# PostHog post-wizard report

The wizard has completed a deep integration of this React Router v7 framework-mode project with PostHog product analytics. It installed the browser and server SDK packages, added PostHog initialization at the client entry point, wrapped the app with `PostHogProvider`, enabled SSR compatibility in Vite, wired project settings through environment variables in `.env`, added client-side `identify()` calls for signup, login, and returning sessions, captured exceptions in the root error boundary, and instrumented key conversion and engagement events across the country exploration flow.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_up` | Captures when a visitor creates a new fake account and starts using the app. | `app/routes/signup.tsx` |
| `user_logged_in` | Captures when an existing user successfully logs into the app. | `app/routes/login.tsx` |
| `user_logged_out` | Captures when an authenticated user logs out from the app. | `app/context/AuthContext.tsx` |
| `countries_explored` | Captures when a user starts exploring the country directory from the home page. | `app/routes/home.tsx` |
| `country_claimed` | Captures when an authenticated user claims a country for points. | `app/routes/countries.tsx` |
| `country_liked` | Captures when an authenticated user favorites a country. | `app/routes/countries.tsx` |
| `country_visited` | Captures when an authenticated user marks a country as visited. | `app/routes/countries.tsx` |
| `country_viewed` | Captures when a user opens a specific country details page. | `app/routes/country.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846839)
- [User signups (wizard)](https://us.posthog.com/project/483112/insights/wWjvorxU)
- [User logins (wizard)](https://us.posthog.com/project/483112/insights/bVkH15bd)
- [Country actions (wizard)](https://us.posthog.com/project/483112/insights/C4TZ8ceA)
- [Explore to signup funnel (wizard)](https://us.posthog.com/project/483112/insights/CYFon9Tc)
- [Profile and stats views (wizard)](https://us.posthog.com/project/483112/insights/UnLpBOzP)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
