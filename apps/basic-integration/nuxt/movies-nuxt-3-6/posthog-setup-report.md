# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Nuxt Movies 3.6 application. `posthog-js` (client-side) and `posthog-node` (server-side) were installed. A Nuxt client plugin was created at `plugins/posthog.client.ts` that initialises PostHog, hooks into Vue errors for automatic exception capture, and exposes `$posthog` to all components via `useNuxtApp()`. TypeScript declarations were added in `types/nuxt-app.d.ts`. The PostHog runtime config was wired into `nuxt.config.ts` and environment variables were written to `.env`. Eight events were instrumented across seven files, covering the complete user journey from authentication through content discovery to video engagement. User identification (`posthog.identify`) is called on login; `posthog.reset()` is called on logout to unlink sessions.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully submits the login form and is authenticated. | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button in the navigation bar. | `components/NavBar.vue` |
| `search_performed` | User submits a search query for movies or TV shows. | `pages/search.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page, the top of the content engagement funnel. | `pages/[type]/[id].vue` |
| `video_played` | User plays a movie or TV show trailer or video clip. | `components/video/Card.vue` |
| `media_tab_switched` | User switches between the Overview, Videos, or Photos tabs on a media detail page. | `components/media/Details.vue` |
| `genre_browsed` | User browses movies or TV shows filtered by a specific genre. | `pages/genre/[no]/movie.vue` |
| `server_login` | Server-side event captured when user authentication is processed. | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1824573)
- [Login → Media Detail Viewed funnel](https://us.posthog.com/project/483112/insights/NVngDDUN)
- [Daily logins and logouts](https://us.posthog.com/project/483112/insights/nUDbGh1e)
- [Top searched queries](https://us.posthog.com/project/483112/insights/0dHlEeSv)
- [Videos played by type](https://us.posthog.com/project/483112/insights/2a6L7itk)
- [Media detail views by type](https://us.posthog.com/project/483112/insights/RzPisKZc)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
