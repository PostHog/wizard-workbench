<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies app. Here is a summary of what was done:

- **Installed** `posthog-js` and `posthog-node` packages.
- **Environment variables** set in `.env` (`NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NUXT_PUBLIC_POSTHOG_HOST`).
- **`nuxt.config.ts`** updated with a `posthog` block under `runtimeConfig.public` so the token and host are accessible on both client and server.
- **`plugins/posthog.client.ts`** created — initialises PostHog on the client, hooks into `vue:error` for automatic exception capture, and provides `$posthog` to all components via `useNuxtApp()`.
- **`types/nuxt-app.d.ts`** created — adds TypeScript types for `$posthog` on the `NuxtApp` interface.
- **User identification** added in `pages/login.vue` — `posthog.identify()` is called with the username immediately after a successful login, correlating all future events with that user.
- **Server-side event** added in `server/api/auth/login.post.ts` — a `posthog-node` client captures `server_login`, using the `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (sent automatically by `posthog-js`) to correlate the server event with the client session.

## Instrumented events

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in. Paired with `posthog.identify()` to set user identity. | `pages/login.vue` |
| `user_logged_out` | User logs out. Followed by `posthog.reset()` to clear the identity. | `components/NavBar.vue` |
| `search_performed` | User submits a search query. Includes `query` property. Top of the content discovery funnel. | `pages/search.vue` |
| `trailer_played` | User clicks the Watch Trailer button on a media hero. Includes `media_id`, `media_title`, `media_type`. | `components/media/Hero.vue` |
| `video_played` | User plays a video clip or featurette. Includes `video_key`, `video_name`, `video_type`. | `components/video/Card.vue` |
| `server_login` | Server-side confirmation of a successful login, correlated with the client session via PostHog tracing headers. | `server/api/auth/login.post.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Logins over time** — Trends chart for `user_logged_in`, to track daily/weekly active users signing in.
2. **Login-to-engagement funnel** — Funnel: `user_logged_in` → `search_performed` → `trailer_played`, to measure content discovery conversion.
3. **Search volume** — Trends chart for `search_performed` with the `query` property breakdown, to see what content users look for most.
4. **Trailer plays** — Trends chart for `trailer_played` broken down by `media_title`, to identify the most-watched trailers.
5. **Video engagement** — Trends chart for `video_played` broken down by `video_type`, to understand which video types (Trailer, Clip, Featurette) drive the most engagement.

You can create these at [/insights](/insights) and pin them to a new [/dashboards](/dashboards) named "Analytics basics".

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
