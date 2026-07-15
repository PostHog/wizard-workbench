# PostHog post-wizard report

PostHog has been integrated into the Nuxt application using `@posthog/nuxt`. The module is configured from `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`, with client and server exception autocapture enabled. Client-side identification is performed after successful login, and logout resets the PostHog identity. Meaningful actions are tracked for authentication, search, and media detail engagement. No user-entered values are included in event properties.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | A user successfully signs in to the movie browsing app. | `pages/login.vue` |
| `user_logged_out` | An authenticated user signs out of the movie browsing app. | `components/NavBar.vue` |
| `movie_search_performed` | A user submits a non-empty movie or show search query. | `pages/search.vue` |
| `media_details_viewed` | A user opens the details page for a movie or TV show. | `pages/[type]/[id].vue` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable during this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any deployment/bootstrap documentation.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

The installed agent skill folder is available at `.claude/skills/integration-nuxt-4` for future PostHog-related development.
