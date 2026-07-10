# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode app (Country Explorer). The following changes were made:

- **`app/entry.client.tsx`** — Initializes PostHog with `posthog.init()` and wraps `HydratedRouter` in `PostHogProvider` so every route component can access PostHog via `usePostHog()`.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react`, and configured a reverse proxy so PostHog requests route through `/ingest` (avoids ad blockers in development).
- **`app/root.tsx`** — Added `captureException` in the `ErrorBoundary` to automatically report unhandled React Router errors to PostHog.
- **`app/routes/login.tsx`** — Calls `posthog.identify()` and captures `user_logged_in` on successful login; captures `user_login_failed` when credentials are not recognized.
- **`app/routes/signup.tsx`** — Calls `posthog.identify()` and captures `user_signed_up` after a new account is created.
- **`app/routes/countries.tsx`** — Captures `country_claimed`, `country_liked`, and `country_visited` (with `country_name` and `region` properties) when a user interacts with a country card.
- **`app/routes/profile.tsx`** — Captures `user_logged_out` and calls `posthog.reset()` when the user clicks Logout, unlinking future events from the current person profile.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account via the signup form. | `app/routes/signup.tsx` |
| `user_logged_in` | User successfully logged in via the login form. | `app/routes/login.tsx` |
| `user_login_failed` | User attempted login but credentials were not recognized. | `app/routes/login.tsx` |
| `country_claimed` | User claimed a country, earning points and potentially unlocking achievements. | `app/routes/countries.tsx` |
| `country_liked` | User liked a country, adding it to their favorites list. | `app/routes/countries.tsx` |
| `country_visited` | User marked a country as visited, collecting a virtual passport stamp. | `app/routes/countries.tsx` |
| `user_logged_out` | User clicked the logout button from their profile page. | `app/routes/profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829325)
- [User Signups (wizard)](https://us.posthog.com/project/483112/insights/LSZR4xZV) — Daily signup counts (bar chart, last 30 days)
- [Login Failures (wizard)](https://us.posthog.com/project/483112/insights/6jlvsxU4) — Login failure trend (line chart, last 30 days)
- [Country Engagement (wizard)](https://us.posthog.com/project/483112/insights/HpmYc4bt) — Stacked bar of claims, likes, and visits per day
- [Country Claims by Region (wizard)](https://us.posthog.com/project/483112/insights/JJ2tuMNN) — Country claims broken down by geographic region
- [Signup to First Claim Funnel (wizard)](https://us.posthog.com/project/483112/insights/BROmglbG) — Conversion funnel from signup to first country claim (14-day window)

Dashboard subscription and alerts were skipped because user confirmation could not be collected in this session. You can set these up manually in PostHog: a weekly email digest is a recurring snapshot of the dashboard, and an alert fires a one-off email when a metric crosses a threshold (e.g. funnel conversion dropping below a baseline).

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on login and signup; users who refresh while already authenticated will remain anonymous until they log in again. Consider calling `posthog.identify()` in `AuthContext`'s mount effect when `getCurrentUser()` returns a stored session.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
