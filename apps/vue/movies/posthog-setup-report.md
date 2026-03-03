<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies application. PostHog is now initialized in `src/main.js` with session replay, autocapture, and a global Vue error handler wired to `captureException`. Users are identified by username on login and the PostHog session is reset on logout. Seven custom events have been instrumented across the key user flows.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/composables/useAuth.ts` |
| `user_login_failed` | Fired when a login attempt fails, with error message | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired when a user logs out | `src/composables/useAuth.ts` |
| `media_viewed` | Fired when a user views a movie or TV show detail page, with id, title, type, and rating | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks Watch Trailer on a media detail page, with id, title, and type | `src/views/MediaDetailView.vue` |
| `search_performed` | Fired when a user submits a search query, with the query string and result count | `src/views/SearchView.vue` |
| `media_card_clicked` | Fired when a user clicks a media card, with id, title, type, and carousel context | `src/components/media/MediaCard.vue` |

## Next steps

To explore user behavior from these events, create an "Analytics basics" dashboard in PostHog with insights like:

- **Login funnel** – trend of `user_logged_in` vs `user_login_failed` to track auth success rate
- **Content engagement** – trend of `media_viewed` and `trailer_played` to see what drives deeper engagement
- **Search usage** – trend of `search_performed` with average `result_count` to measure search effectiveness
- **Navigation patterns** – breakdown of `media_card_clicked` by `media_type` and `carousel_title`

Visit [https://us.posthog.com/project/2](https://us.posthog.com/project/2) to build these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
