# PostHog post-wizard report

PostHog has been integrated into the Vue application with `posthog-js`. The browser SDK initializes before the app mounts using Vite environment variables, with Vue global exception capture enabled. Returning authenticated visitors are identified at startup, and login/logout correctly identify/reset the analytics session. Custom product events cover sign-in, sign-out, media-detail engagement, trailer opens, and completed searches without capturing usernames, search queries, or other user-entered content as event properties.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures a successful sign-in to the movie browsing experience. | `src/composables/useAuth.ts` |
| `user_logged_out` | Captures when an authenticated viewer signs out. | `src/composables/useAuth.ts` |
| `media_detail_viewed` | Captures a media detail page view with non-PII media metadata. | `src/views/MediaDetailView.vue` |
| `trailer_opened` | Captures when a viewer opens a media trailer. | `src/views/MediaDetailView.vue` |
| `search_submitted` | Captures a completed media search without recording the search text. | `src/views/SearchView.vue` |

## Next steps

The PostHog MCP service was unavailable while creating PostHog artifacts, so no dashboard, insights, or shareable notebook were created during this run. Create an **Analytics basics (wizard)** dashboard when the service is available, using the events above for login activity, media-detail engagement, trailer opens, and search completion.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or a bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` and associates sessions with the expected user.

### Agent skill

The Vue PostHog agent skill remains in `.claude/skills/integration-vue-3` for future agent development.
