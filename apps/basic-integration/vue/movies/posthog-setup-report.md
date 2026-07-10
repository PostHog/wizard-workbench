<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. Here's a summary of all changes made:

- **`src/main.js`** — Imported `posthog-js` and called `posthog.init()` before the app mounts, reading credentials from `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` environment variables. Added a global `app.config.errorHandler` that forwards uncaught Vue errors to `posthog.captureException()`.
- **`src/views/LoginView.vue`** — Added `posthog.identify()` and `posthog.capture('user_logged_in')` on successful login. Added `posthog.captureException()` in the catch block for login errors.
- **`src/components/NavBar.vue`** — Added `posthog.capture('user_logged_out')` and `posthog.reset()` before the logout call, so the PostHog session is cleanly unlinked on sign-out.
- **`src/views/SearchView.vue`** — Added `posthog.capture('search_performed', { result_count })` after a successful search, and `posthog.captureException()` on search errors.
- **`src/views/MediaDetailView.vue`** — Added `posthog.capture('media_detail_viewed', { media_id, media_type, media_title })` once real media data loads, `posthog.capture('trailer_watched', { media_id, media_type, media_title })` when the trailer modal opens, and `posthog.captureException()` on media load errors.
- **`.env`** — Created with `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` (covered by `.gitignore`).

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in with a username and password. | `src/views/LoginView.vue` |
| `user_logged_out` | User clicks the logout button in the navigation bar. | `src/components/NavBar.vue` |
| `search_performed` | User submits a search query for movies or TV shows. | `src/views/SearchView.vue` |
| `media_detail_viewed` | User navigates to the detail page of a movie or TV show. | `src/views/MediaDetailView.vue` |
| `trailer_watched` | User opens the trailer modal on a media detail page. | `src/views/MediaDetailView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1829389)
- [Daily Logins](https://us.posthog.com/project/483112/insights/p0jeVRq5) — trend of login events over time
- [Login to Media View Funnel](https://us.posthog.com/project/483112/insights/deLw1S5H) — conversion from login → media detail view → trailer watched
- [Searches Performed](https://us.posthog.com/project/483112/insights/3KW0IP2n) — daily search volume
- [Media Views by Type](https://us.posthog.com/project/483112/insights/IP9uNbiR) — movie vs TV show detail views, stacked by day
- [Logouts (Churn Signal)](https://us.posthog.com/project/483112/insights/kGbZ0EpG) — daily logout count as a churn indicator

Dashboard subscription and alerts were not configured (no response from user). You can set these up at any time from the dashboard in PostHog.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — `useAuth` restores the user from `localStorage` on refresh, but PostHog `identify` is only called on the login form submit, so returning visitors will be on an anonymous distinct ID until they log in again.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
