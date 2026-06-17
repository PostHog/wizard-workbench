# PostHog Setup Report

PostHog is now fully integrated into this Vue movies app — analytics, user identification, and error tracking are all wired and the project builds cleanly.

---

## Installation & Initialization

| Step | Detail |
|------|--------|
| **Package** | `posthog-js` added to `package.json` |
| **Init file** | `src/posthog.js` — initializes the SDK once with token and host from env vars |
| **App entry** | `src/main.js` — imports `src/posthog.js` at startup |
| **Env vars** | `.env` — `VITE_POSTHOG_PUBLIC_KEY` and `VITE_POSTHOG_HOST` (gitignored) |

---

## Events Instrumented

| Event | What it measures | File |
|-------|-----------------|------|
| `user_logged_in` | User successfully authenticated | `src/composables/useAuth.ts` |
| `login_failed` | User login attempt failed with an error | `src/views/LoginView.vue` |
| `user_logged_out` | User logged out | `src/composables/useAuth.ts` |
| `search_performed` | User submitted a search query | `src/views/SearchView.vue` |
| `search_results_returned` | Search API returned results, including zero-result queries | `src/views/SearchView.vue` |
| `media_detail_viewed` | Movie or TV show detail page loaded successfully with real data | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicked Watch Trailer to open the trailer modal | `src/views/MediaDetailView.vue` |
| `trailer_closed` | User closed the trailer modal | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | User clicked a media card (movie or TV show) in a list or carousel | `src/components/media/MediaCard.vue` |
| `media_hero_clicked` | User clicked the featured hero item on the home page | `src/views/HomeView.vue` |

---

## User Identification

**Wired.** `posthog.identify` is called in `src/composables/useAuth.ts` after a successful login, using the username as `distinct_id` and attaching a `username` person property. `posthog.reset()` is called at the start of logout before clearing state and redirecting, so the anonymous session is cleanly separated from the identified one.

---

## Error Tracking

Vue's global `app.config.errorHandler` is registered in `src/main.js` before `app.mount`. Every unhandled Vue error (component lifecycle, watchers, event handlers) is forwarded to PostHog via `posthog.captureException(err)`. No new dependencies were added.

---

## Dashboard

No dashboard was created as part of this run. You can build one manually in PostHog using the events listed above, or run the dashboard wizard step separately.

---

## Build Conflict

The `install` task declared `posthog-js: "^4"` in `package.json`, but `posthog-js` only publishes `1.x` versions (latest: `1.387.0`). The `build` task caught this and corrected the specifier to `"^1"` before running `npm install`. The build then completed successfully — 60 modules transformed, no errors.

---

## Next Steps

1. **Start the app** and exercise the key flows (login, search, open a movie, play a trailer, logout) to confirm events appear in the [PostHog Live Events](https://us.posthog.com/project/2/activity/explore) view.
2. **Check Persons** — after logging in, your username should appear as an identified person with the `username` property set.
3. **Check Error Tracking** — deliberately trigger an error (or check the [Issues](https://us.posthog.com/project/2/error_tracking) tab) to confirm `captureException` is forwarding errors.
4. **Build a dashboard** — use the 10 events above to create funnels (search → media detail → trailer played), trends (daily logins, search volume), and retention charts.
5. **Commit the changes** — the modified files are `package.json`, `src/posthog.js`, `src/main.js`, `src/composables/useAuth.ts`, `src/views/LoginView.vue`, `src/views/SearchView.vue`, `src/views/MediaDetailView.vue`, `src/components/media/MediaCard.vue`, `src/views/HomeView.vue`, and `.posthog-events.json`. The `.env` file is gitignored and should not be committed.
