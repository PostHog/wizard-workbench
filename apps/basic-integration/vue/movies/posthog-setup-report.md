<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. PostHog is initialized in `src/main.js` with your project token and host pulled from environment variables, with a global Vue error handler wired to `posthog.captureException`. Users are identified by username on successful login, and the PostHog session is reset on logout. Five events are tracked across four files covering the full user journey from authentication through content discovery.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully signs in to the app. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user clicks the logout button. | `src/components/NavBar.vue` |
| `media_detail_viewed` | Fired when a user views the detail page for a movie or TV show. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user opens the trailer modal for a movie or TV show. | `src/views/MediaDetailView.vue` |
| `media_search_performed` | Fired when a user submits a search query for movies or TV shows. | `src/views/SearchView.vue` |

## Next steps

Visit your PostHog project to create a dashboard with insights based on these events:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create an "Analytics basics (wizard)" dashboard with trends for each event above
- [Insights](https://us.posthog.com/project/2/insights) — build individual insights (e.g. login → media detail viewed funnel, search volume over time, trailer play rate)

Suggested insights to build:
1. **Login trend** — `user_logged_in` count over time
2. **Content engagement funnel** — `user_logged_in` → `media_detail_viewed` → `trailer_played`
3. **Search volume** — `media_search_performed` count over time with `query` breakdown
4. **Media detail views by type** — `media_detail_viewed` broken down by `media_type`
5. **Logout rate** — `user_logged_out` vs `user_logged_in` ratio

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
