# PostHog post-wizard report

The wizard integrated PostHog analytics across the Nuxt client and authentication API. It added the `posthog-js` client plugin with Vue exception capture and tracing headers, configured runtime values from Nuxt public environment variables, and installed `posthog-js` and `posthog-node`. Authentication uses a stable SHA-256-derived distinct ID on the client so raw usernames are not captured as event properties. Server-side authentication events use the tracing headers and flush before each request finishes.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures a successful client-side sign-in. | `composables/useAuth.ts` |
| `user_logged_out` | Captures a client-side sign-out before the identity is reset. | `composables/useAuth.ts` |
| `media_search_submitted` | Captures a submitted search using only query length metadata. | `pages/search.vue` |
| `media_details_tab_selected` | Captures selection of a media detail content tab. | `components/media/Details.vue` |
| `login_succeeded` | Captures a successful server-side authentication operation. | `server/api/auth/login.post.ts` |
| `logout_succeeded` | Captures a successful server-side logout operation. | `server/api/auth/logout.post.ts` |

## Next steps

Dashboard and notebook creation could not be completed because the configured PostHog MCP server was unavailable from this environment. Create an **Analytics basics (wizard)** dashboard in PostHog and add insights for the event names listed above once the MCP connection is restored.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in this project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
