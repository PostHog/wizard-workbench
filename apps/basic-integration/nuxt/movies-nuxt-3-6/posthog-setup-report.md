# PostHog post-wizard report

The wizard integrated PostHog into the Nuxt 3.5 application using `posthog-js` for browser analytics and `posthog-node` for server-side authentication events. Runtime configuration reads the public project token and host from Nuxt environment variables. Client initialization enables autocapture, pageview capture, tracing headers, and exception autocapture. Login and returning-session identification, logout reset, search submissions, media detail tab selections, server login, server logout, and Vue error capture were added with minimal changes.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Tracks a successful user login in the client. | `pages/login.vue` |
| `user_logged_out` | Tracks when a user logs out of the application. | `composables/useAuth.ts` |
| `search_submitted` | Tracks when a user submits a media search. | `pages/search.vue` |
| `media_tab_selected` | Tracks selection of overview, video, or photo details for media. | `components/media/Details.vue` |
| `server_login_succeeded` | Tracks successful authentication at the server boundary. | `server/api/auth/login.post.ts` |
| `server_logout` | Tracks logout requests at the server boundary. | `server/api/auth/logout.post.ts` |

## Next steps

A live dashboard and insights could not be created because the PostHog MCP server was unavailable during this run.

- Dashboard: Not created (PostHog MCP connection failed)
- Insights: Not created (PostHog MCP connection failed)

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any deployment/bootstrap configuration.
- [ ] Wire source-map upload into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path identifies an already-authenticated user on page refresh.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code.
