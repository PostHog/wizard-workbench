# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode application (Country Explorer). PostHog is initialized client-side in `entry.client.tsx` using `posthog-js` and `@posthog/react`, with a `PostHogProvider` wrapping the app. A reverse proxy is configured in Vite to route analytics requests through `/ingest` to avoid ad-blockers. A server-side PostHog middleware (`app/lib/posthog-middleware.ts`) is registered at the root route to correlate client and server sessions via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers. Error tracking is wired into the root `ErrorBoundary`. Users are identified on login and signup, and `posthog.reset()` is called on logout. Key interaction events are captured across five route files.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Tracks when a user successfully creates a new account. | `app/routes/signup.tsx` |
| `user_logged_in` | Tracks when a user successfully logs in. | `app/routes/login.tsx` |
| `user_logged_out` | Tracks when a user clicks the logout button on their profile page. | `app/routes/profile.tsx` |
| `country_claimed` | Tracks when a user claims a country on the countries list. | `app/routes/countries.tsx` |
| `country_liked` | Tracks when a user likes a country on the countries list. | `app/routes/countries.tsx` |
| `country_visited` | Tracks when a user marks a country as visited on the countries list. | `app/routes/countries.tsx` |
| `country_viewed` | Tracks when a user opens a specific country detail page, the top of the claim conversion funnel. | `app/routes/country.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901898)
- [User signups (wizard)](https://us.posthog.com/project/483112/insights/8FR0mxBx)
- [User logins (wizard)](https://us.posthog.com/project/483112/insights/3PkENUEZ)
- [Country engagement: claimed, liked, visited (wizard)](https://us.posthog.com/project/483112/insights/5w2vLbzk)
- [Country claim funnel (wizard)](https://us.posthog.com/project/483112/insights/8zLFZ7bt)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
