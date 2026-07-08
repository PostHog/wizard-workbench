<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the Country Explorer React Router v7 app. PostHog is initialised in `entry.client.tsx` with the `PostHogProvider` wrapper so every component can access the SDK via `usePostHog()`. Six user-action events are now captured across login, signup, logout, and the three country interaction actions (claim, like, visit). Users are identified on login and signup using their stable internal ID (not PII), and `posthog.reset()` is called on logout to unlink future sessions. Error tracking is wired into the root `ErrorBoundary` via `captureException`. The Vite config was updated with `ssr.noExternal` for PostHog packages (required for SSR mode) and a reverse-proxy configuration for the ingest endpoints.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully creates a new account | `app/routes/signup.tsx` |
| `user_logged_in` | Fired when a user successfully logs in | `app/routes/login.tsx` |
| `user_logged_out` | Fired when a user clicks the logout button on their profile | `app/routes/profile.tsx` |
| `country_claimed` | Fired when a user claims a country on the countries list page | `app/routes/countries.tsx` |
| `country_liked` | Fired when a user likes a country on the countries list page | `app/routes/countries.tsx` |
| `country_visited` | Fired when a user marks a country as visited on the countries list page | `app/routes/countries.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816739)
- [Signup & Login funnel (wizard)](https://us.posthog.com/project/483112/insights/CYcsa0Qb)
- [Signups & Logins over time (wizard)](https://us.posthog.com/project/483112/insights/Ft6vbTJL)
- [Country interactions by type (wizard)](https://us.posthog.com/project/483112/insights/7K5ePnyi)
- [Country claims by region (wizard)](https://us.posthog.com/project/483112/insights/ICF8lAX6)
- [User retention after signup (wizard)](https://us.posthog.com/project/483112/insights/TL5n7yDi)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
