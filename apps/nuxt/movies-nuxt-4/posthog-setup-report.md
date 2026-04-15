<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt 4 movies application. The `@posthog/nuxt` module was installed and configured, providing automatic client-side initialization, session replay, and error tracking. A server-side PostHog Node client utility was created for API route tracking. Seven events were instrumented across client and server code, including user identification on login and session reset on logout.

## Changes made

| File | Change |
|------|--------|
| `nuxt.config.ts` | Added `@posthog/nuxt` to modules; added `posthogConfig` with public key, host, client exception capture, and server exception autocapture; added `posthog` to `runtimeConfig.public` |
| `server/utils/posthog.ts` | Created — shared PostHog Node client singleton for server-side event capture |
| `server/api/auth/login.post.ts` | Added `server_login` event with `username`, `$session_id`, and `distinctId` extracted from `X-POSTHOG-*` headers |
| `pages/login.vue` | Added `posthog.identify()` and `user_logged_in` event on successful login; added `captureException` on login failure |
| `components/NavBar.vue` | Added `user_logged_out` event and `posthog.reset()` before logout |
| `pages/search.vue` | Added `search_performed` event with `query` property |
| `components/video/Card.vue` | Added `video_played` event with `video_name`, `video_type`, and `video_key` properties |
| `pages/[type]/[id].vue` | Added `media_detail_viewed` event on mount with `media_id`, `media_type`, and `media_title` |
| `components/LanguageSwitcher.vue` | Added `language_changed` event with `from_locale` and `to_locale` properties |
| `.env` | Set `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired on the client when a user successfully logs in. Also identifies the user with PostHog. | `pages/login.vue` |
| `user_logged_out` | Fired on the client when a user clicks the logout button. Resets the PostHog session. | `components/NavBar.vue` |
| `server_login` | Server-side event fired on the login API route when a user successfully authenticates. | `server/api/auth/login.post.ts` |
| `search_performed` | Fired when a user submits a search query on the search page. | `pages/search.vue` |
| `video_played` | Fired when a user clicks to play a video/trailer for a movie or TV show. | `components/video/Card.vue` |
| `media_detail_viewed` | Fired when a user views a movie or TV show detail page (top of conversion funnel). | `pages/[type]/[id].vue` |
| `language_changed` | Fired when a user switches the display language of the app. | `components/LanguageSwitcher.vue` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Login conversion funnel** — Funnel: `media_detail_viewed` → `user_logged_in`
   - Measures how many visitors who view media content end up logging in
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#funnel)

2. **Daily active users (logins)** — Trend: `user_logged_in` unique users over time
   - Shows daily login activity and user growth
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

3. **Top searches** — Table: `search_performed` broken down by `query` property
   - Reveals which content users are looking for most
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

4. **Video engagement rate** — Trend: `video_played` vs `media_detail_viewed` over time
   - Shows how often users who view media details go on to play a video
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

5. **Churn signal: logouts** — Trend: `user_logged_out` over time
   - Tracks logout volume as a proxy for session abandonment
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

To auto-create dashboards and insights in future runs, add a `PERSONAL_API_KEY` to your `.env` file (get one at https://us.posthog.com/settings/user-api-keys with `organization:read` and `error_tracking:write` scopes).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
