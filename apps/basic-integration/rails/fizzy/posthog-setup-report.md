# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, a collaborative project management application. The integration includes server-side event tracking via `posthog-rails`, client-side tracking via `posthog-js`, automatic exception capture, user identification on login and signup, and a PostHog dashboard with key business insights.

## Changes made

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completed account signup by providing their name and creating an account. | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | A user successfully authenticated via a magic link and started a new session. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | A user explicitly terminated their session by signing out. | `app/controllers/sessions_controller.rb` |
| `user_joined_via_invite` | A user joined an account by redeeming a join code invite link. | `app/controllers/join_codes_controller.rb` |
| `board_created` | A user created a new board to organize cards and workflows. | `app/controllers/boards_controller.rb` |
| `board_deleted` | A user deleted an existing board and all its contents. | `app/controllers/boards_controller.rb` |
| `board_published` | A user published a board to make it publicly accessible via shareable link. | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A user published a new card (task/issue) on a board. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | A user closed a card, marking it as completed or resolved. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A user reopened a previously closed card. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | A user moved a card to 'not now', deferring it for later consideration. | `app/controllers/cards/not_nows_controller.rb` |
| `comment_added` | A user added a comment to a card to collaborate with teammates. | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | A user toggled the assignment of a card to a team member. | `app/controllers/cards/assignments_controller.rb` |
| `card_marked_golden` | A user marked a card as golden to flag it as high priority or important. | `app/controllers/cards/goldnesses_controller.rb` |
| `account_cancelled` | An account owner cancelled and deleted their account, a critical churn signal. | `app/controllers/account/cancellations_controller.rb` |

Additional files modified:
- `Gemfile` + `Gemfile.lock` — Added `posthog-ruby` and `posthog-rails` gems
- `config/initializers/posthog.rb` — PostHog initialization with auto exception capture and ActiveJob instrumentation
- `config/initializers/content_security_policy.rb` — Added PostHog domains to `script_src` and `connect_src`
- `app/models/user.rb` — Added `posthog_distinct_id` and `posthog_properties` methods
- `app/controllers/application_controller.rb` — Added `current_user` helper for posthog-rails user context
- `app/views/layouts/shared/_head.html.erb` — Added posthog-js snippet with CSP nonce and per-user `identify` call

## Next steps

A dashboard has been created with key insights to monitor user behavior:

- **Dashboard:** [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1777487)
  - New signups over time
  - Signup to first card funnel
  - Card completion rate
  - Account churn
  - Daily active engagement

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the posthog-js snippet in `_head.html.erb` identifies on every page load for authenticated users, covering returning sessions.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
