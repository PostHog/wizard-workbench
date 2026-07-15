# PostHog post-wizard report

PostHog has been integrated into this Nuxt application using the `@posthog/nuxt` module for browser analytics and automatic exception capture, plus `posthog-node` for server-side authentication tracking. Configuration reads the public project key and host exclusively from Nuxt environment variables. The authentication flow identifies demo users with a stable application-derived ID on login and returning visits, captures logout before resetting the browser identity, and correlates the server-side login event through PostHog request headers.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Tracks a successful demo sign-in after the authentication request completes. | `composables/useAuth.ts` |
| `user_logged_out` | Tracks when an authenticated user signs out of the application. | `composables/useAuth.ts` |
| `search_submitted` | Tracks submission of a media search with non-sensitive result context. | `pages/search.vue` |
| `media_tab_selected` | Tracks selection of content tabs on a media detail page. | `components/media/Details.vue` |
| `server_login_completed` | Tracks a completed login at the authentication API boundary with correlated session context. | `server/api/auth/login.post.ts` |

## Next steps

The PostHog MCP endpoint was unavailable in this environment, so the requested dashboard, insights, and shareable notebook could not be created during this run. Once the MCP service is available, create the **Analytics basics (wizard)** dashboard and add trends for the five events above, including a login-to-search funnel.

## Verify before merging

The production build was attempted but is currently blocked by an existing `@nuxtjs/i18n` and `unhead` export incompatibility (`getActiveHead`). The project-wide typecheck also has pre-existing Nuxt configuration and dependency resolution errors.

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` to any monorepo or bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` after an authenticated page load.

### Agent skill

An agent skill folder remains in the project at `.claude/skills/integration-nuxt-4` for future PostHog development work.
