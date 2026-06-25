<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. PostHog (`posthog-js`) was installed and initialized in `src/main.js` with your project token and host pulled from environment variables. A global Vue error handler was wired up to route uncaught exceptions to PostHog's error tracking. Six events are now captured across four key files, covering user authentication, content discovery, and engagement. User identity is linked on login via `posthog.identify()` and cleared on logout via `posthog.reset()`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates and is redirected to the home page. | `src/views/LoginView.vue` |
| `login_failed` | User attempts to log in but encounters an error. | `src/views/LoginView.vue` |
| `user_logged_out` | User clicks the logout button and their session is cleared. | `src/components/NavBar.vue` |
| `media_detail_viewed` | User views the detail page for a specific movie or TV show. | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks the 'Watch Trailer' button to open the trailer modal. | `src/views/MediaDetailView.vue` |
| `search_performed` | User submits a search query and results are returned. | `src/views/SearchView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1760791)
- [User Logins](https://us.i.posthog.com/project/483112/insights/Z4f2nVtG)
- [Searches Performed](https://us.i.posthog.com/project/483112/insights/9JWjwjCX)
- [Media Detail Views](https://us.i.posthog.com/project/483112/insights/TMaaB9v0)
- [Trailer Plays](https://us.i.posthog.com/project/483112/insights/GbCh0P04)
- [Login → Media View → Trailer Funnel](https://us.i.posthog.com/project/483112/insights/VUCL5rqp)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_POSTHOG_PROJECT_TOKEN`, `VITE_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
