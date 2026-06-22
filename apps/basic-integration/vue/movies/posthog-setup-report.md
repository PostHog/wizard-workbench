<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into the Vue Movies app. PostHog is now initialised in `src/main.js` using environment variables, with a global Vue error handler wired to `posthog.captureException`. Users are identified on login, and the PostHog session is reset on logout. Ten custom events are captured across five files, covering the full user journey from authentication through media browsing, search, and trailer playback.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates and enters the app. | `src/views/LoginView.vue` |
| `login_failed` | User attempts login but encounters a validation or auth error. | `src/views/LoginView.vue` |
| `user_logged_out` | User clicks the logout button and ends their session. | `src/components/NavBar.vue` |
| `media_searched` | User submits a search query to find movies or TV shows. | `src/views/SearchView.vue` |
| `search_no_results` | A search query returns no results, indicating a content gap. | `src/views/SearchView.vue` |
| `media_detail_viewed` | User opens the detail page for a specific movie or TV show. | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks the Watch Trailer button to open the trailer modal. | `src/views/MediaDetailView.vue` |
| `trailer_closed` | User dismisses the trailer modal. | `src/views/MediaDetailView.vue` |
| `recommendation_clicked` | User clicks a recommended item on a media detail page. | `src/views/MediaDetailView.vue` |
| `hero_item_clicked` | User clicks the featured hero item on the home page. | `src/views/HomeView.vue` |

## Next steps

A PostHog dashboard was not automatically created because the API key available in this environment is missing the `dashboard:write` scope. To create a recommended analytics dashboard manually, go to **PostHog → Dashboards → New dashboard** and add these insights:

1. **Engagement funnel** — Funnel: `user_logged_in` → `media_detail_viewed` → `trailer_played`
2. **Login success vs failure** — Trend: `user_logged_in` and `login_failed` over time
3. **Search engagement** — Trend: `media_searched` and `search_no_results` over time
4. **Trailer engagement** — Trend: `trailer_played` and `trailer_closed` over time
5. **Top actions** — Trend: all events over time (stacked)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
