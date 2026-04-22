<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Fizzy Rails application. The following changes were made:

**Gem installation** — `posthog-ruby` and `posthog-rails` were added to the `Gemfile`. Run `bundle install` to complete the installation.

**Initializer** — `config/initializers/posthog.rb` was created to initialize PostHog with API key and host from environment variables, and to configure posthog-rails auto-instrumentation (automatic exception capture, rescued exception reporting, and ActiveJob instrumentation).

**User model** — `posthog_distinct_id` (using the identity email address) and `posthog_properties` (name, account_id, role, created_at) were added to `app/models/user.rb` to support user identification and error association.

**Frontend snippet** — The posthog-js snippet was added to `app/views/layouts/shared/_head.html.erb` with a CSP nonce, loaded only when `POSTHOG_PROJECT_TOKEN` is set. It also calls `posthog.identify()` for authenticated users to correlate frontend and backend events.

**CSP** — `config/initializers/content_security_policy.rb` was updated to derive PostHog CDN and API hosts from `POSTHOG_HOST` and permit them in `script-src` and `connect-src`.

**Environment variables** — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` were written to `.env`.

**Event tracking** — `PostHog.capture` calls were added to 9 controller files covering all major business events.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user completes account signup | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | User authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_logged_out` | User destroys their session | `app/controllers/sessions_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `board_published` | Board is made publicly accessible | `app/controllers/boards/publications_controller.rb` |
| `card_created` | Card is published from draft | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | Card is closed/resolved | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Card is moved to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | User posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `card_gilded` | Card is marked golden/high priority | `app/controllers/cards/goldnesses_controller.rb` |
| `account_cancelled` | Account owner cancels account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

To complete setup, run `bundle install` to install the `posthog-ruby` and `posthog-rails` gems.

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Signup funnel** — Funnel: `user_logged_in` → `user_signed_up` (conversion from login attempt to completed signup)
2. **Card creation trend** — Trend: `card_created` over time (volume of new cards published)
3. **Card completion rate** — Trend: `card_closed` vs `card_created` (ratio of cards resolved)
4. **Churn signal** — Trend: `account_cancelled` over time (critical retention metric)
5. **Engagement depth** — Trend: `comment_created` and `card_gilded` over time (collaboration signals)

You can create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
