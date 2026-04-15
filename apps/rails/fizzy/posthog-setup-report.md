<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, the collaborative project management application. Here is a summary of what was added:

**Backend (posthog-ruby + posthog-rails):** The `posthog-ruby` and `posthog-rails` gems were added to the Gemfile. A PostHog initializer was created at `config/initializers/posthog.rb` with auto-exception capture, rescued exception reporting, ActiveJob failure instrumentation, and automatic user context from `current_user`. Server-side events are captured across 10 controllers covering the full user lifecycle — from signup through active use to account cancellation.

**User identification:** The `User` model was extended with `posthog_distinct_id` (using the identity's email address) and `posthog_properties` methods. `ApplicationController` gained a `current_user` helper so posthog-rails can auto-associate errors with the logged-in user. Users are identified on login (magic link authentication) and on signup completion.

**Frontend (posthog-js):** The PostHog JS snippet was added to `app/views/layouts/shared/_head.html.erb` with a CSP nonce for compatibility with Fizzy's strict Content Security Policy. When a user is logged in, `posthog.identify()` is called on every page load to keep frontend and backend events correlated. `CSP_SCRIPT_SRC` and `CSP_CONNECT_SRC` env vars were set to allow PostHog's JS asset and API domains.

**Environment variables:** `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `CSP_SCRIPT_SRC`, and `CSP_CONNECT_SRC` were written to `.env`.

---

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user completes signup and account is created | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | User authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `card_created` | Card is published from draft editor | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | Card is closed (resolved/completed) | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Previously closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `board_created` | New board is created | `app/controllers/boards_controller.rb` |
| `board_deleted` | Board is deleted | `app/controllers/boards_controller.rb` |
| `comment_created` | User posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `card_triaged` | Card is moved from triage into a board column | `app/controllers/cards/triages_controller.rb` |
| `account_cancelled` | Account owner cancels and deletes the account (churn) | `app/controllers/account/cancellations_controller.rb` |
| `card_gilded` | Card is marked as golden/high-priority | `app/controllers/cards/goldnesses_controller.rb` |
| `board_published` | Board is published publicly with a shareable link | `app/controllers/boards/publications_controller.rb` |

---

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five recommended insights:

1. **Signup funnel** — Funnel: `user_signed_up` → `board_created` → `card_created` — measures how many new users activate by creating their first board and card.

2. **Daily logins trend** — Trend: `user_logged_in` over time — tracks daily active user engagement.

3. **Card creation rate** — Trend: `card_created` over time — shows how much work is being created across all accounts.

4. **Card closure rate** — Trend: `card_closed` over time — measures productivity and task completion across teams.

5. **Churn events** — Trend: `account_cancelled` over time — tracks the most critical business health signal.

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
