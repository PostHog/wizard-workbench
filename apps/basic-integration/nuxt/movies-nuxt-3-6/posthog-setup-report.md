# PostHog post-wizard report

The wizard integrated PostHog into the Nuxt 3.6 application with browser and server SDKs, environment-backed runtime configuration, default autocapture and session recording, Vue exception capture, authenticated-user identification, logout reset behavior, and targeted product events. Server authentication events retain browser session context through PostHog tracing headers and flush before each request completes.

| Event | Description | File |
| --- | --- | --- |
| `user_logged_in` | A user successfully signs in to the application. | `composables/useAuth.ts` |
| `user_logged_out` | An authenticated user signs out of the application. | `composables/useAuth.ts` |
| `search_submitted` | A user submits a new movie search. | `pages/search.vue` |
| `media_viewed` | A user views the details for a movie or TV show. | `pages/[type]/[id].vue` |
| `media_selected` | A user selects a movie or TV show card from a collection. | `components/media/Card.vue` |
| `login_completed` | The server successfully completes an authentication request. | `server/api/auth/login.post.ts` |
| `logout_completed` | The server successfully completes a logout request. | `server/api/auth/logout.post.ts` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP endpoint was unavailable during setup. Reconnect the PostHog MCP server and create **Analytics basics (wizard)** using the event contract above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or a bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` and remains associated with the authenticated user.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
