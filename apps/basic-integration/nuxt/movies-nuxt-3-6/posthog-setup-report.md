<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies application (Nuxt 3.6). The integration includes client-side analytics via `posthog-js`, server-side event tracking via `posthog-node`, user identification on login, session/user correlation between client and server, Vue error capture, and a TypeScript type declaration for `$posthog`.

**Files created:**
- `plugins/posthog.client.ts` — Initializes PostHog on the client, hooks into `vue:error` for automatic error capture, and provides `$posthog` to all components.
- `types/nuxt-app.d.ts` — TypeScript declaration extending `NuxtApp` with `$posthog`.

**Files modified:**
- `nuxt.config.ts` — Added `posthog` block to `runtimeConfig.public` (reads from env vars).
- `.env` — Added `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`.
- `pages/login.vue` — Identifies the user and captures `user_logged_in` after successful login.
- `components/NavBar.vue` — Captures `user_logged_out` and calls `posthog.reset()` on logout.
- `pages/search.vue` — Captures `search_performed` with the search query.
- `pages/[type]/[id].vue` — Captures `media_viewed` with media id, type, title, and rating.
- `components/video/Card.vue` — Captures `video_played` with video key, name, and type.
- `pages/genre/[no]/movie.vue` — Captures `genre_browsed` with genre id, name, and media type.
- `server/api/auth/login.post.ts` — Captures `server_login` server-side via `posthog-node`, correlating with the client session via `X-PostHog-Session-ID` / `X-PostHog-Distinct-ID` headers.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `pages/login.vue` |
| `user_logged_out` | User logs out via the navbar | `components/NavBar.vue` |
| `search_performed` | User performs a search query | `pages/search.vue` |
| `media_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User clicks to play a video trailer | `components/video/Card.vue` |
| `genre_browsed` | User browses movies or TV shows by genre | `pages/genre/[no]/movie.vue` |
| `server_login` | Server-side login event correlated with client session | `server/api/auth/login.post.ts` |

## Next steps

We've prepared five insights for your **"Analytics basics"** dashboard. Create a new dashboard at the link below, then add each insight:

**[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)**

### Insights to add

1. **Login trend** — Daily `user_logged_in` events over time
   [Open insight](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6InVzZXJfbG9nZ2VkX2luIiwibmFtZSI6InVzZXJfbG9nZ2VkX2luIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjowfV0sImRhdGVfZnJvbSI6Ii0zMGQiLCJpbnRlcnZhbCI6ImRheSJ9)

2. **Login → Media view funnel** — Conversion from `user_logged_in` to `media_viewed`
   [Open insight](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiRlVOTkVMUyIsImV2ZW50cyI6W3siaWQiOiJ1c2VyX2xvZ2dlZF9pbiIsIm5hbWUiOiJ1c2VyX2xvZ2dlZF9pbiIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6MH0seyJpZCI6Im1lZGlhX3ZpZXdlZCIsIm5hbWUiOiJtZWRpYV92aWV3ZWQiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjF9XSwiZGF0ZV9mcm9tIjoiLTMwZCJ9)

3. **Top search queries** — `search_performed` broken down by `query` property
   [Open insight](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6InNlYXJjaF9wZXJmb3JtZWQiLCJuYW1lIjoic2VhcmNoX3BlcmZvcm1lZCIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6MH1dLCJicmVha2Rvd24iOiJxdWVyeSIsImJyZWFrZG93bl90eXBlIjoiZXZlbnQiLCJkYXRlX2Zyb20iOiItMzBkIn0=)

4. **Most viewed media** — `media_viewed` broken down by `media_title`
   [Open insight](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6Im1lZGlhX3ZpZXdlZCIsIm5hbWUiOiJtZWRpYV92aWV3ZWQiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjB9XSwiYnJlYWtkb3duIjoibWVkaWFfdGl0bGUiLCJicmVha2Rvd25fdHlwZSI6ImV2ZW50IiwiZGF0ZV9mcm9tIjoiLTMwZCJ9)

5. **Logout / churn trend** — Daily `user_logged_out` events over time
   [Open insight](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZXZlbnRzIjpbeyJpZCI6InVzZXJfbG9nZ2VkX291dCIsIm5hbWUiOiJ1c2VyX2xvZ2dlZF9vdXQiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjB9XSwiZGF0ZV9mcm9tIjoiLTMwZCJ9)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
