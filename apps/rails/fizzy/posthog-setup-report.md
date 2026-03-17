<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy, a Ruby on Rails kanban/issue-tracking application. The integration covers server-side event capture via `posthog-rails` + `posthog-ruby`, frontend pageview and session tracking via `posthog-js`, and automatic user identification on login and signup.

**Files changed:**

- `Gemfile` — added `posthog-ruby` and `posthog-rails` gems
- `config/initializers/posthog.rb` — new file: PostHog client init + Rails auto-instrumentation config (auto exception capture, ActiveJob instrumentation, user context)
- `app/models/user.rb` — added `posthog_distinct_id` and `posthog_properties` for user association in error reports and identify calls
- `app/controllers/application_controller.rb` — added `current_user` helper delegating to `Current.user` so posthog-rails can detect the current user in controller contexts
- `app/views/layouts/shared/_head.html.erb` — added posthog-js snippet with `posthog.identify()` for authenticated users
- 10 controller files with `PostHog.capture` calls (see table below)
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`

| Event | Description | File |
|---|---|---|
| `signed_up` | User completed signup and created a new account | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | User authenticated via magic link and started a new session | `app/controllers/sessions/magic_links_controller.rb` |
| `signed_out` | User explicitly ended their session | `app/controllers/sessions_controller.rb` |
| `board_created` | User created a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | User deleted a board | `app/controllers/boards_controller.rb` |
| `board_published` | User published a board publicly | `app/controllers/boards/publications_controller.rb` |
| `card_created` | User created a new card on a board | `app/controllers/cards_controller.rb` |
| `card_closed` | User closed (resolved) a card | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopened a previously closed card | `app/controllers/cards/closures_controller.rb` |
| `comment_created` | User posted a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner cancelled and deleted the account | `app/controllers/account/cancellations_controller.rb` |
| `export_started` | Admin or owner initiated an account data export | `app/controllers/account/exports_controller.rb` |
| `import_started` | User started an account data import | `app/controllers/account/imports_controller.rb` |

## Next steps

To see your data in PostHog, create a new dashboard called **"Analytics basics"** and add these recommended insights:

1. **Signup funnel** — Funnel from `signed_in` → `board_created` → `card_created` to measure onboarding conversion
2. **Daily active users** — Unique users who fired any event, grouped by day
3. **Card activity** — Trend of `card_created`, `card_closed`, `card_reopened` over time to measure product engagement
4. **Churn signals** — Trend of `account_cancelled` events, broken down by week
5. **Collaboration depth** — Trend of `comment_created` events per user to measure team engagement

Go to [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) to create your dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
