<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. The `@posthog/nuxt` module was installed and configured with automatic client-side and server-side error tracking enabled. A server-side PostHog utility (`server/utils/posthog.ts`) was created to provide a shared singleton Node.js client for API routes. Seven events were instrumented across five pages and one server route, covering the key user actions: authentication, content discovery, and search. User identification is performed client-side on login, and server-side login events are correlated with the client session via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (automatically injected by the `@posthog/nuxt` module).

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired client-side when a user successfully logs in. Identifies the user in PostHog. | `pages/login.vue` |
| `user_logged_out` | Fired when the user clicks logout in the nav bar. Resets the PostHog session. | `components/NavBar.vue` |
| `server_login` | Server-side login event capturing session/distinct ID for cross-domain correlation. | `server/api/auth/login.post.ts` |
| `media_detail_viewed` | Fired when a user views a movie or TV show detail page. Tracks content type and title. | `pages/[type]/[id].vue` |
| `search_performed` | Fired on the first page of results when a user searches. Tracks query and result count. | `pages/search.vue` |
| `category_browsed` | Fired when a user browses a media category listing. | `pages/[type]/category/[query].vue` |
| `person_viewed` | Fired when a user views an actor/director profile page. | `pages/person/[id].vue` |

## Next steps

Visit your PostHog project to explore the data from these events and build insights:

- **Trends** – [View all events in PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- **Login funnel** – [Build a funnel: user_logged_in → media_detail_viewed](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)
- **Search analysis** – [Explore search_performed event](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- **Session replay** – [Watch user sessions](https://us.posthog.com/project/2/replay)
- **Error tracking** – [View captured exceptions](https://us.posthog.com/project/2/error_tracking)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
