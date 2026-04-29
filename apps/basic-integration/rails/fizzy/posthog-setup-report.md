<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy, the Rails-based collaborative project management app. Here is a summary of all changes made:

- **Gemfile** — Added `posthog-ruby` and `posthog-rails` gems.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`config/initializers/posthog.rb`** — New initializer that sets up the PostHog client and enables auto-capture of exceptions, rescued exceptions, ActiveJob failures, and user context via `posthog-rails`.
- **`app/models/user.rb`** — Added `posthog_distinct_id` (returns the identity's email address) and `posthog_properties` methods for consistent user identification across backend events and error reports.
- **`app/controllers/application_controller.rb`** — Added a private `current_user` helper wrapping `Current.user` so `posthog-rails` can automatically associate errors with the authenticated user.
- **`app/views/layouts/shared/_head.html.erb`** — Added the `posthog-js` frontend snippet for pageview capture, session replay, and client-side event tracking. When a user is authenticated, `posthog.identify()` is called immediately to link frontend events to the backend `distinct_id`.
- **Controller files** — Added `PostHog.capture` calls for 13 business events (see table below). Added `PostHog.identify` on sign-in and signup completion to associate backend events with the correct person profile.

| Event Name | Description | File |
|---|---|---|
| `signed_up` | User submits their email to start the signup process | `app/controllers/signups_controller.rb` |
| `signup_completed` | User finishes signup (sets name, account created) | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | User authenticates via magic link and starts a session | `app/controllers/sessions/magic_links_controller.rb` |
| `signed_out` | User explicitly logs out | `app/controllers/sessions_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | User deletes a board | `app/controllers/boards_controller.rb` |
| `board_published` | User publishes a board publicly | `app/controllers/boards/publications_controller.rb` |
| `card_created` | User creates a new card on a board | `app/controllers/cards_controller.rb` |
| `card_closed` | User closes (resolves) a card | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopens a previously closed card | `app/controllers/cards/closures_controller.rb` |
| `card_comment_created` | User posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `card_gilded` | User marks a card as golden (high priority) | `app/controllers/cards/goldnesses_controller.rb` |
| `account_cancelled` | Account owner cancels and deletes the account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1346453)
- [Daily Sign Ups & Sign Ins](https://us.posthog.com/project/2/insights/S7ZgfEVJ)
- [Churn Signals](https://us.posthog.com/project/2/insights/1GcEqNEk)
- [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/876Kj61f)
- [Team Growth Activity](https://us.posthog.com/project/2/insights/BVccAOVs)
- [Subscription Revenue Events](https://us.posthog.com/project/2/insights/bxo4bUnw)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
