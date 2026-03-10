<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Ruby on Rails application. The integration adds full-stack tracking covering user authentication lifecycle, card workflow actions, collaboration events, and board management — using `posthog-rails` for automatic exception capture and `posthog-js` for client-side pageview and session replay tracking.

## Summary of changes

- **`Gemfile`** — Added `posthog-ruby` and `posthog-rails` gems
- **`config/initializers/posthog.rb`** — Created PostHog initializer with `PostHog.init` and `PostHog::Rails.configure` for auto exception capture, ActiveJob instrumentation, and user context detection
- **`app/models/user.rb`** — Added `posthog_distinct_id` (returns user email) and `posthog_properties` methods for automatic user association
- **`app/controllers/application_controller.rb`** — Added `current_user` private helper returning `Current.user` for posthog-rails auto-detection
- **`app/views/layouts/shared/_head.html.erb`** — Added posthog-js snippet with CSP nonce and server-side `posthog.identify()` call for authenticated users
- **`.env`** — Added `POSTHOG_API_KEY_RAILS` and `POSTHOG_HOST` environment variables

## Instrumented events

| Event | Description | File |
|-------|-------------|------|
| `signed_up` | User completed signup and created a new account | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | User authenticated via magic link and started a new session | `app/controllers/sessions/magic_links_controller.rb` |
| `signed_out` | User explicitly terminated their session | `app/controllers/sessions_controller.rb` |
| `card_created` | User published a new card (task) to a board | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | User marked a card as closed/completed | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopened a previously closed card | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User postponed a card to 'not now' | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | User triaged a card into a specific column | `app/controllers/cards/triages_controller.rb` |
| `comment_created` | User added a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `board_created` | User created a new board | `app/controllers/boards_controller.rb` |
| `board_published` | User made a board publicly accessible | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | User removed public access from a board | `app/controllers/boards/publications_controller.rb` |
| `card_gilded` | User marked a card as golden (high priority) | `app/controllers/cards/goldnesses_controller.rb` |
| `webhook_created` | User created a new webhook for a board | `app/controllers/webhooks_controller.rb` |

## Next steps

Create an "Analytics basics" dashboard in PostHog at https://us.posthog.com/project/2/dashboards with these recommended insights:

1. **User Acquisition Funnel** — Funnel: `signed_up` → `signed_in` → `card_created`
2. **New Signups Over Time** — Trend: `signed_up` (unique users, daily)
3. **Card Completion Rate** — Trend: `card_created` vs `card_closed` (stacked bar, daily)
4. **Card Churn (Postponed)** — Trend: `card_postponed` (daily) — signals users pushing work away
5. **Collaboration Depth** — Trend: `comment_created` (total events, daily) — measures engagement

To create the dashboard:
1. Go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards)
2. Click **New dashboard** → name it "Analytics basics"
3. Add the five insights above using **New insight** → Trends or Funnels

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
