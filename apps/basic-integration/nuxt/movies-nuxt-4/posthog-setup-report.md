# PostHog post-wizard report

The wizard has completed a deep integration of this Nuxt project with PostHog product analytics and error tracking. The setup now initializes `@posthog/nuxt` through `nuxt.config.ts`, adds a shared `posthog-node` server utility for Nitro routes, stores the PostHog key and host in environment variables, identifies users on login, resets identity on logout, forwards tracing headers for client/server correlation, and captures key client-side and server-side product events across login, search, media exploration, video playback, gallery usage, and logout flows.

| Event name | Description | File |
| --- | --- | --- |
| `login_submitted` | Captured when a visitor successfully signs in from the login page. | `pages/login.vue` |
| `logout_completed` | Captured when an authenticated user signs out of the application. | `components/NavBar.vue` |
| `media_opened` | Captured when a visitor opens a movie or TV show details page from a media card or hero link. | `components/media/Card.vue` |
| `media_tab_selected` | Captured when a visitor switches between overview, videos, and photos tabs on a media details page. | `components/media/Details.vue` |
| `video_play_started` | Captured when a visitor starts playing a trailer or related video. | `components/video/Card.vue` |
| `photo_gallery_opened` | Captured when a visitor opens the photo gallery modal for media or people. | `components/photo/Modal.vue` |
| `search_performed` | Captured when a visitor runs a search query for media. | `pages/search.vue` |
| `person_profile_opened` | Captured when a visitor opens a person profile from a cast or crew card. | `components/person/Card.vue` |
| `server_login_succeeded` | Captured on the server after login succeeds and the auth cookie is set. | `server/api/auth/login.post.ts` |
| `server_logout_completed` | Captured on the server when the auth cookie is cleared during logout. | `server/api/auth/logout.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846789)
- [Successful logins over time (wizard)](https://us.posthog.com/project/483112/insights/9D0Lo4sV)
- [Searches over time (wizard)](https://us.posthog.com/project/483112/insights/mcUI4kKL)
- [Media engagement by event (wizard)](https://us.posthog.com/project/483112/insights/NhAOnkOm)
- [Login to media engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/7qitXqVG)
- [Logout volume (wizard)](https://us.posthog.com/project/483112/insights/Bj6iQQyb)

A PostHog notebook copy could not be created because the current MCP credentials do not include the `notebook:write` scope.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
