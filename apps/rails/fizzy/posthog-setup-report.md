<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, a collaborative project management and issue tracking application. The integration covers the full user lifecycle — from signup through daily usage to churn — using both server-side Ruby tracking via `posthog-ruby` + `posthog-rails`, and client-side JavaScript tracking via `posthog-js`.

**What was set up:**

- **Gems added** to `Gemfile`: `posthog-ruby` and `posthog-rails`
- **Initializer** created at `config/initializers/posthog.rb` with auto-capture exceptions, ActiveJob instrumentation, and user context detection from `Current.user`
- **User model** updated with `posthog_distinct_id` (email address via identity) and `posthog_properties` helper methods for consistent user identification
- **13 server-side events** instrumented across 10 controller files covering authentication, board/card lifecycle, collaboration, and account churn
- **Frontend snippet** (`posthog-js`) added to the shared layout head partial with auto-identify for logged-in users
- **Environment variables** configured in `.env` (`POSTHOG_API_KEY`, `POSTHOG_HOST`)

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | New user completes account setup with full name after magic link | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | Existing user authenticates successfully via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_logged_out` | User explicitly destroys their session | `app/controllers/sessions_controller.rb` |
| `board_created` | User creates a new board (project workspace) | `app/controllers/boards_controller.rb` |
| `board_deleted` | A board is permanently deleted — churn signal | `app/controllers/boards_controller.rb` |
| `card_created` | New card (task/issue) created via API | `app/controllers/cards_controller.rb` |
| `card_closed` | User closes/completes a card — key completion event | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Previously closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User manually postpones a card to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | Card is moved from triage queue into a workflow column | `app/controllers/cards/triages_controller.rb` |
| `comment_added` | User posts a new comment on a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner permanently cancels the account | `app/controllers/account/cancellations_controller.rb` |
| `board_published` | Board is published publicly via shareable link | `app/controllers/boards/publications_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Analytics basics dashboard**: https://us.posthog.com/project/2/dashboard/1295697
- 🔁 **Signup to First Card Funnel** (activation): https://us.posthog.com/project/2/insights/BJPcjsLy
- 👥 **User Authentication Activity** (signups, logins, logouts): https://us.posthog.com/project/2/insights/Gfw51sma
- 🃏 **Card Lifecycle** (created, closed, reopened): https://us.posthog.com/project/2/insights/t18Hsaa2
- 🚀 **Feature Engagement** (boards, cards, comments): https://us.posthog.com/project/2/insights/Q3S36ek6
- ⚠️ **Churn Indicator — Account Cancellations**: https://us.posthog.com/project/2/insights/xfExrxR3

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
