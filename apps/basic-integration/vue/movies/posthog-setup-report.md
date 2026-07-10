<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Vue 3 + Vite project with PostHog. The SDK was installed and initialized in the app entrypoint, environment variables were added for the PostHog token and host, global Vue error handling now reports exceptions to PostHog, authenticated sessions are identified on login and refresh, logout resets the PostHog session, and targeted product analytics events were added across login, search, media discovery, content loading, and trailer engagement flows.

| Event name | Description | File |
| --- | --- | --- |
| user_logged_in | Captures successful sign-in after demo authentication completes. | `src/composables/useAuth.ts` |
| user_logged_out | Captures when an authenticated user logs out from the navigation. | `src/composables/useAuth.ts` |
| media_detail_viewed | Captures when a movie or TV detail page finishes loading media content. | `src/views/MediaDetailView.vue` |
| trailer_started | Captures when a user starts watching a trailer from a media detail page. | `src/views/MediaDetailView.vue` |
| search_performed | Captures when a user submits a catalog search and receives results. | `src/views/SearchView.vue` |
| media_selected | Captures when a user selects a movie or TV card to open details. | `src/components/media/MediaCard.vue` |
| content_collection_loaded | Captures when a homepage or list carousel successfully loads catalog content. | `src/components/carousel/CarouselAutoQuery.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831111)
- [Login to media detail funnel (wizard)](https://us.posthog.com/project/483112/insights/pJkIT93O)
- [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/lb5IH454)
- [Media detail views over time (wizard)](https://us.posthog.com/project/483112/insights/zoK4gTPf)
- [Searches over time (wizard)](https://us.posthog.com/project/483112/insights/QkYNH7Jh)
- [Content collection loads (wizard)](https://us.posthog.com/project/483112/insights/pBS6Pyzv)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
