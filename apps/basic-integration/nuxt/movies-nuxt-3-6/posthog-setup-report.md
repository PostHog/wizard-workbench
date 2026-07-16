# PostHog post-wizard report

PostHog is integrated across this Nuxt 3 application. The browser SDK initializes in a client plugin using public runtime configuration from environment variables, with default autocapture and session recording retained. Vue-rendering exceptions are captured automatically.

The authentication flow now identifies signed-in users with a deterministic hashed analytics identifier rather than submitting user-entered names in event data. It tracks client and API completion events, forwards client tracing context to server routes, and flushes server-side analytics before those short-lived requests return. Product interactions for search, title detail views, and detail tabs are also captured.

| Event | Description | Instrumented in |
| --- | --- | --- |
| `login_succeeded` | A user successfully signs in to the application. | `composables/useAuth.ts` |
| `login_completed` | The authentication endpoint completes a successful demo login. | `server/api/auth/login.post.ts` |
| `logout_completed` | An authenticated user completes logout. | `composables/useAuth.ts`, `server/api/auth/logout.post.ts` |
| `search_submitted` | A visitor submits a media search. | `pages/search.vue` |
| `media_details_viewed` | A visitor views a movie or television title's detail page. | `pages/[type]/[id].vue` |
| `media_tab_selected` | A visitor selects a content tab on a media detail page. | `components/media/Details.vue` |

## Next steps

A dashboard and in-app notebook could not be created because the configured PostHog MCP server was unavailable in this environment. Create **Analytics basics (wizard)** after connectivity is restored, using the events above. Recommended views are: login conversion, searches over time, detail views by media type, tab selection, and completed logouts.

## Verify before merging

- [ ] Run the project typecheck and fix its existing generated-file configuration errors; the production build completed successfully.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in the project at `.claude/skills/integration-nuxt-3-6` for future PostHog development work.
