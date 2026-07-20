# PostHog post-wizard report

The wizard integrated PostHog into this Vue 3/Vite application using environment-based configuration. It installed `posthog-js`, initialized it before the app mounts, retained default autocapture and session recording behavior, added global Vue exception capture, identifies users on login and returning authenticated sessions, resets identity on logout, and instruments key authentication, search, and trailer engagement actions. The production build completed successfully.

| Event | Description | File |
| --- | --- | --- |
| `user_logged_in` | A user successfully signs in to the movie browsing application. | `src/composables/useAuth.ts` |
| `user_logged_out` | An authenticated user signs out of the application. | `src/composables/useAuth.ts` |
| `media_searched` | A user completes a movie or TV search, including whether results were returned. | `src/views/SearchView.vue` |
| `trailer_played` | A user starts a trailer from a media detail page. | `src/views/MediaDetailView.vue` |

## Next steps

The PostHog MCP endpoint was unavailable during setup, so the live dashboard, insights, and shareable notebook could not be created. Once MCP access is restored, create **Analytics basics (wizard)** with views for login activity, logout activity, searches and result availability, and trailer engagement.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the Vite upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` in the deployed app and associates refreshed sessions with the expected user.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
