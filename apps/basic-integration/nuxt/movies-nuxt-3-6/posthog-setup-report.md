<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies 3.6 application. The integration includes client-side product analytics via `posthog-js`, server-side tracking via `posthog-node`, user identification on login/logout, and automatic error capture.

Key changes made:
- Installed `posthog-js` and `posthog-node` packages
- Created `plugins/posthog.client.ts` — initializes PostHog on the client, hooks into `vue:error` for automatic error capture, and provides `$posthog` to all components
- Created `types/nuxt-app.d.ts` — TypeScript declarations for `$posthog` on the NuxtApp interface
- Updated `nuxt.config.ts` — added `posthog` runtime config block (reads from environment variables)
- Added `.env` — stores `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`
- Added `onErrorCaptured` in `app.vue` for Vue component-level error boundary tracking
- Added `posthog.identify()` on login in `pages/login.vue` to link sessions to users
- Added `posthog.reset()` on logout in `components/NavBar.vue` to clear user association
- Server-side login and logout API routes now create a `PostHog` Node client per request, extract session/distinct ID from request headers (`x-posthog-session-id`, `x-posthog-distinct-id`), and use `withContext()` to correlate server events with the client session

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login; also calls `identify()` with the username | `pages/login.vue` |
| `user_logged_out` | Fired when the logout button is clicked; also calls `reset()` | `components/NavBar.vue` |
| `media_viewed` | Fired when a movie or TV show detail page is loaded (top of engagement funnel) | `pages/[type]/[id].vue` |
| `search_performed` | Fired when a user submits a search query | `pages/search.vue` |
| `media_tab_viewed` | Fired when a user switches tabs (Overview, Videos, Photos) on a media detail page | `components/media/Details.vue` |
| `server_login` | Server-side event fired on successful authentication via the login API | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side event fired when the logout API is called | `server/api/auth/logout.post.ts` |

## Next steps

The API key used during setup did not have dashboard/insight write scopes, so the dashboard was not auto-created. You can create it manually in PostHog:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a new dashboard named "Analytics basics (wizard)"
- [New Insight](https://us.posthog.com/project/2/insights/new) — suggested insights to add:
  - **Login funnel** — `user_logged_in` → `media_viewed` (conversion from login to content engagement)
  - **Login volume trend** — `user_logged_in` over time
  - **Search activity trend** — `search_performed` over time
  - **Media engagement breakdown** — `media_viewed` broken down by `media_type` (movie vs. tv)
  - **Tab engagement** — `media_tab_viewed` broken down by `tab` property

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
