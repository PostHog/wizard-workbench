<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was installed with npm, initialized in the Vue app entrypoint with Vite environment variables, wired into Vue global error handling, and added across the app's authentication, navigation, discovery, content engagement, and API failure flows. The integration also identifies authenticated demo users with a stable distinct ID, resets identity on logout, and includes a PostHog dashboard plus five saved insights for the new analytics surface.

| Event name | Description | File |
| --- | --- | --- |
| `login_submitted` | Tracks when a user submits the login form to enter the app. | `src/views/LoginView.vue` |
| `login_failed` | Tracks when login validation fails before the user can enter the app. | `src/views/LoginView.vue` |
| `user_logged_in` | Tracks when a user successfully authenticates and starts an app session. | `src/composables/useAuth.ts` |
| `user_logged_out` | Tracks when an authenticated user ends the current app session. | `src/components/NavBar.vue` |
| `home_hero_loaded` | Tracks when the home hero content successfully loads as a top-of-funnel experience. | `src/views/HomeView.vue` |
| `media_list_loaded` | Tracks when a movie or TV listing page successfully loads featured content. | `src/views/MediaListView.vue` |
| `media_detail_viewed` | Tracks when a specific movie or TV detail page finishes loading content. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Tracks when a user opens a trailer from hero or detail content. | `src/views/MediaDetailView.vue` |
| `search_performed` | Tracks when a user runs a search for movies or TV shows. | `src/views/SearchView.vue` |
| `search_result_opened` | Tracks when a user opens a search result to inspect a specific title. | `src/components/media/MediaCard.vue` |
| `carousel_loaded` | Tracks when a homepage or category carousel successfully loads media items. | `src/components/carousel/CarouselAutoQuery.vue` |
| `navigation_selected` | Tracks when a user selects a primary navigation destination. | `src/components/NavBar.vue` |
| `tmdb_request_failed` | Tracks when a TMDB proxy request fails and prevents content from loading. | `src/composables/useTMDB.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825455
- Insight: Logins over time (wizard) — https://us.posthog.com/project/483112/insights/vhoSI5Pa
- Insight: Login funnel (wizard) — https://us.posthog.com/project/483112/insights/K7tISBp9
- Insight: Searches by outcome (wizard) — https://us.posthog.com/project/483112/insights/8QrmVamC
- Insight: Media detail views (wizard) — https://us.posthog.com/project/483112/insights/itJkAwAa
- Insight: TMDB request failures (wizard) — https://us.posthog.com/project/483112/insights/nqjLBYUo

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap scripts so collaborators know what to set: `VITE_POSTHOG_PROJECT_TOKEN`, `VITE_POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` so previously authenticated sessions stay associated with the expected distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
