<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, a Rails-based kanban project management app. The integration adds server-side event tracking via the `posthog-ruby` and `posthog-rails` gems, client-side session replay and pageview tracking via `posthog-js`, automatic exception capture for unhandled controller errors, and user identification tied to the global `Identity` model.

**Changes made:**
- **`Gemfile`** — Added `posthog-ruby` (required as `posthog`) and `posthog-rails`
- **`config/initializers/posthog.rb`** — New PostHog initializer with auto-exception capture, ActiveJob instrumentation, and current-user context
- **`app/models/user.rb`** — Added `posthog_distinct_id` (returns `identity.id`, the stable cross-account UUID) and `posthog_properties` helper methods
- **`app/controllers/application_controller.rb`** — Added `current_user` helper returning `Current.user`, required by posthog-rails for user context in error reports
- **`app/views/layouts/shared/_head.html.erb`** — Added posthog-js snippet for client-side pageview and session replay; auto-identifies authenticated users by `posthog_distinct_id`
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completed signup by providing their name and creating an account. | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | A user successfully authenticated via magic link and started a new session. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_logged_out` | A user terminated their session and logged out. | `app/controllers/sessions_controller.rb` |
| `board_created` | A user created a new board for organizing cards. | `app/controllers/boards_controller.rb` |
| `board_published` | A board was published publicly with a shareable link. | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A user created a new card (task/issue) on a board. | `app/controllers/cards_controller.rb` |
| `card_closed` | A user closed (completed) a card. | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | A card moved from the triage queue into a workflow column. | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | A user postponed a card by moving it to the 'not now' list. | `app/controllers/cards/not_nows_controller.rb` |
| `card_assigned` | A user was assigned to or unassigned from a card. | `app/controllers/cards/assignments_controller.rb` |
| `card_gilded` | A card was marked as golden (high priority/important). | `app/controllers/cards/goldnesses_controller.rb` |
| `comment_created` | A user posted a comment on a card. | `app/controllers/cards/comments_controller.rb` |
| `account_export_started` | An admin or owner initiated a full account data export. | `app/controllers/account/exports_controller.rb` |
| `account_cancelled` | An account owner cancelled and deleted the account. | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1761313)
- [Signup & Login Trend](https://us.posthog.com/project/483112/insights/IB7Oa7QE) — daily signups and logins over 30 days
- [User Signup Funnel](https://us.posthog.com/project/483112/insights/AiOAegwk) — conversion from login to completed signup
- [Card Activity](https://us.posthog.com/project/483112/insights/GXYbJOUV) — card creation, closure, and triage over 30 days
- [Collaboration Activity](https://us.posthog.com/project/483112/insights/YqosXg8k) — comments and assignments over 30 days
- [Churn Signal](https://us.posthog.com/project/483112/insights/Zn0v3GTP) — postponed cards and account cancellations over 30 days

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures. Add `PostHog.test_mode = true` to `config/environments/test.rb` if events fire during tests.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the posthog-js snippet identifies on every page load for authenticated users, but verify this covers your SSR/Turbo-Drive navigation patterns.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
