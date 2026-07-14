# PostHog post-wizard report

The wizard has completed a deep integration of this Vue 3 application with PostHog product analytics and error tracking. The integration installs `posthog-js`, initializes it in the SPA entrypoint with Vue/Vite environment variables, adds a Vue global error handler that reports exceptions to PostHog, restores identified sessions on app load, identifies authenticated users with a hashed username-based distinct ID, resets PostHog on logout, and captures key product events across login, discovery, media browsing, and trailer engagement flows.

| Event name | Description | File |
| --- | --- | --- |
| `login_submitted` | Tracks when a visitor submits the login flow successfully. | `src/composables/useAuth.ts` |
| `login_failed` | Tracks when a login attempt fails validation or authentication. | `src/views/LoginView.vue` |
| `session_restored` | Tracks when an authenticated session is restored on app load. | `src/App.vue` |
| `logout_clicked` | Tracks when an authenticated visitor logs out. | `src/composables/useAuth.ts` |
| `home_hero_loaded` | Tracks when the signed-in home hero content loads successfully. | `src/views/HomeView.vue` |
| `media_list_hero_loaded` | Tracks when the featured item for a media list page loads. | `src/views/MediaListView.vue` |
| `carousel_loaded` | Tracks when a carousel finishes loading media results. | `src/components/carousel/CarouselAutoQuery.vue` |
| `media_details_loaded` | Tracks when a movie or TV detail page loads its media metadata. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Tracks when a visitor opens a trailer from the media detail experience. | `src/views/MediaDetailView.vue` |
| `search_performed` | Tracks when a visitor performs a media search. | `src/views/SearchView.vue` |
| `search_result_selected` | Tracks when a visitor opens a media result from a search or carousel card. | `src/components/media/MediaCard.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Notebook mirroring could not be completed because notebook creation is unavailable to this MCP environment:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846911)
- Insight: [Login outcomes (wizard)](https://us.posthog.com/project/483112/insights/0qA15KX2)
- Insight: [Search engagement (wizard)](https://us.posthog.com/project/483112/insights/CE7uZeQH)
- Insight: [Content loading signals (wizard)](https://us.posthog.com/project/483112/insights/ydAkRR2d)
- Insight: [Trailer conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/3wlpXsIQ)
- Insight: [Session and logout activity (wizard)](https://us.posthog.com/project/483112/insights/Ri2fiiXA)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
