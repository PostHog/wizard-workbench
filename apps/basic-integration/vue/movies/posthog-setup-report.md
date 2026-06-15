<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies app. PostHog was initialized in `src/main.js` using environment variables for the project token and host, with a global Vue error handler wired to `posthog.captureException`. User identification is performed on login, and `posthog.reset()` is called on logout to clear the session. Five custom events are now tracked across four files covering the core user journey: sign-in, sign-out, media discovery, trailer engagement, and search.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in to the app | `src/views/LoginView.vue` |
| `user_logged_out` | User signs out of the app | `src/components/NavBar.vue` |
| `media_detail_viewed` | User views the detail page for a movie or TV show | `src/views/MediaDetailView.vue` |
| `trailer_played` | User opens the trailer modal for a movie or TV show | `src/views/MediaDetailView.vue` |
| `search_performed` | User submits a search query for movies or TV shows | `src/views/SearchView.vue` |

## Next steps

Dashboard creation requires `dashboard:write`, `insight:write`, and `query:read` scopes on the PostHog API key. These were not available during this wizard run. Once those scopes are granted, create a dashboard named **"Analytics basics (wizard)"** in your PostHog project with insights such as:

1. **Login trend** — Trends chart for `user_logged_in` over time
2. **Search volume** — Trends chart for `search_performed` over time
3. **Login → Media detail funnel** — Funnel from `user_logged_in` → `media_detail_viewed`
4. **Media detail → Trailer funnel** — Funnel from `media_detail_viewed` → `trailer_played`
5. **Logout trend** — Trends chart for `user_logged_out` over time (churn signal)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login, so returning sessions that skip the login form will remain on anonymous distinct IDs until `useAuth` is extended to call `posthog.identify` when restoring a session from `localStorage`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
