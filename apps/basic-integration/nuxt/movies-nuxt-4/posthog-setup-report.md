# PostHog post-wizard report

The wizard integrated PostHog into the Nuxt application with client and server initialization, default autocapture and session recording behavior, automatic exception capture, authenticated-user identification, logout reset behavior, and targeted product events for authentication, search, media selection, trailers, and videos. Client-to-server tracing headers correlate browser activity with authentication API events. PostHog configuration reads the project token and host from Nuxt environment variables.

| Event | Description | File |
| --- | --- | --- |
| `user_logged_in` | A user successfully signs in to the application. | `pages/login.vue` |
| `user_logged_out` | An authenticated user signs out of the application. | `composables/useAuth.ts` |
| `search_submitted` | A user submits a non-empty movie or television search. | `pages/search.vue` |
| `media_selected` | A user selects a media card to open its detail page. | `components/media/Card.vue` |
| `trailer_played` | A user starts the primary trailer from a media hero. | `components/media/Hero.vue` |
| `video_played` | A user starts a video from the media video collection. | `components/video/Card.vue` |
| `server_user_logged_in` | The server successfully completes a login request. | `server/api/auth/login.post.ts` |
| `server_user_logged_out` | The server successfully completes a logout request. | `server/api/auth/logout.post.ts` |

## Next steps

The PostHog MCP endpoint was unavailable during this run, so the live dashboard, insights, and notebook could not be created. Once connectivity is restored, create an **Analytics basics (wizard)** dashboard containing an authentication funnel and trends for search, media selection, trailer playback, and video playback.

## Verify before merging

- [x] Run a full production build and fix any lint or type errors introduced by the generated code. The production build passes; type checking now reports only the pre-existing rule typing error in `unocss.config.ts`.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names to any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` and returning sessions retain the authenticated distinct ID.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
