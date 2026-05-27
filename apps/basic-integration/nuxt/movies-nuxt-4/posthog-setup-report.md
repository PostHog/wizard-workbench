# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies application. The `@posthog/nuxt` module was installed and configured with automatic client-side and server-side error tracking. Seven events are now captured across login, content discovery, content engagement, and language preferences — plus a server-side login event that correlates back to the client session via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` request headers. Users are identified by username on login (client-side) and reset on logout.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired on successful login; also calls `posthog.identify()` with the username | `pages/login.vue` |
| `user_logged_out` | Fired when the user clicks logout; also calls `posthog.reset()` | `components/NavBar.vue` |
| `media_searched` | Fired when a search query is submitted, with the `query` property | `pages/search.vue` |
| `media_viewed` | Fired on movie/TV show detail page load, with `media_type`, `media_id`, and `title` | `pages/[type]/[id].vue` |
| `video_played` | Fired when a trailer/clip play button is clicked, with `video_name`, `video_type`, and `video_key` | `components/video/Card.vue` |
| `language_changed` | Fired when the user picks a different locale, with `from_language` and `to_language` | `components/LanguageSwitcher.vue` |
| `server_login` | Server-side login event capturing `username` and PostHog `$session_id`; uses `posthog-node` via a singleton utility | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1633097)
- [New Insight — Login funnel (user_logged_in → media_viewed → video_played)](https://us.posthog.com/project/2/insights/new)
- [New Insight — Search volume trend (media_searched over time)](https://us.posthog.com/project/2/insights/new)
- [New Insight — Content engagement trend (media_viewed + video_played over time)](https://us.posthog.com/project/2/insights/new)
- [New Insight — Language distribution (language_changed breakdown by to_language)](https://us.posthog.com/project/2/insights/new)
- [New Insight — Login/logout lifecycle (user_logged_in vs user_logged_out)](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
