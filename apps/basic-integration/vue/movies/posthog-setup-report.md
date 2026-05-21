<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. The `posthog-js` SDK was installed and initialized in `src/main.js` with environment variable-based configuration and a global Vue error handler. User identification is performed on login and the PostHog session is reset on logout. Custom events are captured across six key user interactions spanning authentication, content discovery, and engagement.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; also calls `posthog.identify()` with the username | `src/composables/useAuth.ts` |
| `user_logged_out` | User clicks logout; also calls `posthog.reset()` to clear the session | `src/composables/useAuth.ts` |
| `media_detail_viewed` | User views a movie or TV show detail page (top of engagement funnel) | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks the Watch Trailer button on a media detail page | `src/views/MediaDetailView.vue` |
| `search_performed` | User submits a search query; includes query text and result count | `src/views/SearchView.vue` |
| `media_card_clicked` | User clicks a media card to navigate to the detail page | `src/components/media/MediaCard.vue` |

## Next steps

Build a dashboard in PostHog with insights based on the events above. Here are suggested insights to create in your project:

- **Login trend** — Daily `user_logged_in` event count to monitor active users: [New insight](https://us.posthog.com/project/2/insights/new)
- **Engagement funnel** — Conversion funnel `user_logged_in` → `media_detail_viewed` → `trailer_played` to measure content engagement: [New funnel](https://us.posthog.com/project/2/insights/new)
- **Search volume** — `search_performed` trend with `result_count` average to track search usage: [New insight](https://us.posthog.com/project/2/insights/new)
- **Media discovery** — `media_card_clicked` breakdown by `media_type` to see movie vs TV preference: [New insight](https://us.posthog.com/project/2/insights/new)
- **Churn signal** — `user_logged_out` trend relative to `user_logged_in` to monitor session completion rate: [New insight](https://us.posthog.com/project/2/insights/new)

Create an "Analytics basics" dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
