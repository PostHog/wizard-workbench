<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. Both client-side and server-side tracking have been set up, along with user identification, error tracking, and an "Analytics basics" dashboard plan.

## Changes Made

### New files created
- **`plugins/posthog.client.ts`** — Nuxt client plugin that initializes PostHog with `posthog-js`, enables `__add_tracing_headers` for client↔server correlation, and hooks into `vue:error` for automatic Vue error capture.
- **`types/nuxt-app.d.ts`** — TypeScript declaration that extends the `NuxtApp` interface with `$posthog`, enabling typed access to PostHog throughout the app.

### Modified files
- **`nuxt.config.ts`** — Added `posthog` block to `runtimeConfig.public` (`publicKey`, `host`, `posthogDefaults`) so keys are read from environment variables and available on both client and server.
- **`.env`** — Added `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

### Files with event tracking added

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired (client) when a user successfully logs in. Also calls `posthog.identify()` with the username. | `pages/login.vue` |
| `login_failed` | Fired (client) when a login attempt fails, with `error_message` property. | `pages/login.vue` |
| `user_logged_out` | Fired (client) when the user clicks logout in the NavBar. Also calls `posthog.reset()`. | `components/NavBar.vue` |
| `media_viewed` | Fired (client) when a user opens a movie or TV show detail page. Properties: `media_type`, `media_id`, `media_title`. | `pages/[type]/[id].vue` |
| `search_performed` | Fired (client) when a search query is executed (first page only). Properties: `search_query`, `result_count`. | `pages/search.vue` |
| `person_viewed` | Fired (client) when a person (actor/director) detail page is viewed. Properties: `person_id`, `person_name`. | `pages/person/[id].vue` |
| `error_displayed` | Fired (client) when the global error page renders. Properties: `status_code`, `error_message`, `is_404`. Non-404 errors are also sent to `captureException`. | `error.vue` |
| `server_user_logged_in` | Fired (server) in the login API route after successful auth. Correlates with the client session via `x-posthog-session-id` / `x-posthog-distinct-id` headers. | `server/api/auth/login.post.ts` |

## Next steps

We've designed an "Analytics basics" dashboard for you to set up in PostHog with 5 insights based on the events we just instrumented. Visit your PostHog project to create them:

- **[Create a new dashboard →](https://us.posthog.com/project/2/dashboard)** — Name it "Analytics basics"

Suggested insights to add:

1. **[Login → Media View Funnel](https://us.posthog.com/project/2/insights/new)** — Funnel: `user_logged_in` → `media_viewed` (conversion from login to first content engagement)
2. **[Daily Active Users](https://us.posthog.com/project/2/insights/new)** — Trend: unique users firing `user_logged_in` per day
3. **[Top Search Queries](https://us.posthog.com/project/2/insights/new)** — Trend table: `search_performed` broken down by `search_query`
4. **[Media Views by Type](https://us.posthog.com/project/2/insights/new)** — Trend: `media_viewed` broken down by `media_type` (movie vs tv)
5. **[Error Rate](https://us.posthog.com/project/2/insights/new)** — Trend: `error_displayed` events per day to monitor app health

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
