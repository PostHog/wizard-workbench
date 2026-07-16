# PostHog post-wizard report

PostHog is integrated into this Nuxt application with `@posthog/nuxt` for browser capture and `posthog-node` for server-side authentication events. Configuration reads `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` from the local environment. Client exception capture, server exception autocapture, and request correlation headers are enabled.

Authenticated users are identified with a stable SHA-256-derived identifier, rather than their username. User-entered usernames are not sent as event properties. Returning authenticated users are re-identified from the stored stable identifier, and logout resets the browser identity.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures a successful client-side login after the user is identified. | `composables/useAuth.ts` |
| `user_logged_out` | Captures when an authenticated user signs out. | `composables/useAuth.ts` |
| `search_submitted` | Captures a movie or television search submission with non-sensitive result context. | `pages/search.vue` |
| `media_details_viewed` | Captures viewing a movie or television detail page. | `pages/[type]/[id].vue` |
| `media_details_tab_selected` | Captures switching among overview, videos, and photos on a media detail page. | `components/media/Details.vue` |
| `media_card_selected` | Captures navigation to a media detail page from a media card. | `components/media/Card.vue` |
| `server_login_completed` | Captures successful authentication handling in the API with correlated session context. | `server/api/auth/login.post.ts` |
| `server_logout_completed` | Captures successful logout handling in the API with correlated session context. | `server/api/auth/logout.post.ts` |

## Next steps

The PostHog MCP service was unavailable in this environment, so the requested dashboard, insights, and shareable notebook could not be created during this run. Create an **Analytics basics (wizard)** dashboard in PostHog once the MCP service is available, using the events listed above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in the project under `.claude/skills/` for future PostHog development.
