<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, a collaborative kanban-style project management app. The integration covers user identification at login and signup, 15 business-critical event captures across boards, cards, and account lifecycle, automatic exception tracking via `posthog-rails`, and a `posthog-js` frontend snippet for session replay and pageview tracking.

## Changes made

| File | Change |
|------|--------|
| `Gemfile` | Added `posthog-ruby` and `posthog-rails` gems |
| `config/initializers/posthog.rb` | Created PostHog initializer with auto-exception tracking and ActiveJob instrumentation |
| `app/models/user.rb` | Added `posthog_distinct_id` and `posthog_properties` methods |
| `app/controllers/application_controller.rb` | Added `current_user` helper for posthog-rails user context detection |
| `app/views/layouts/shared/_head.html.erb` | Added posthog-js snippet with `identify` for authenticated users |
| `app/controllers/sessions/magic_links_controller.rb` | `identify` + `user_signed_in` capture on successful magic-link auth |
| `app/controllers/signups/completions_controller.rb` | `identify` + `account_signed_up` capture on account creation |
| `app/controllers/boards_controller.rb` | `board_created` and `board_deleted` captures |
| `app/controllers/boards/publications_controller.rb` | `board_published` and `board_unpublished` captures |
| `app/controllers/cards_controller.rb` | `card_created` capture (JSON format) |
| `app/controllers/cards/closures_controller.rb` | `card_closed` and `card_reopened` captures |
| `app/controllers/cards/not_nows_controller.rb` | `card_postponed` capture |
| `app/controllers/cards/triages_controller.rb` | `card_triaged` capture with column name |
| `app/controllers/cards/comments_controller.rb` | `card_comment_created` capture |
| `app/controllers/cards/assignments_controller.rb` | `card_assigned` capture |
| `app/controllers/cards/goldnesses_controller.rb` | `card_gilded` capture |
| `app/controllers/account/cancellations_controller.rb` | `account_cancelled` capture (before cancellation executes) |

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates via a magic link and a new session starts. | `app/controllers/sessions/magic_links_controller.rb` |
| `account_signed_up` | User completes account creation by providing their full name and an account is provisioned. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | A new kanban board is created within an account. | `app/controllers/boards_controller.rb` |
| `board_deleted` | A board and all its contents are permanently deleted. | `app/controllers/boards_controller.rb` |
| `board_published` | A board is published publicly and becomes accessible via a shareable link. | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | A previously public board is taken down and its shareable link deactivated. | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A new card (task/issue) is published to a board. | `app/controllers/cards_controller.rb` |
| `card_closed` | A card is marked as closed/resolved. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A previously closed card is reopened. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | A card is moved to 'not now', postponing it from the active workflow. | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | A card is triaged from the inbox into a specific board column. | `app/controllers/cards/triages_controller.rb` |
| `card_comment_created` | A comment is added to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | A user is assigned to (or unassigned from) a card. | `app/controllers/cards/assignments_controller.rb` |
| `card_gilded` | A card is marked as golden, flagging it as high priority or important. | `app/controllers/cards/goldnesses_controller.rb` |
| `account_cancelled` | The account owner cancels and deletes their account. | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built a dashboard and insights in PostHog based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1813110)
- **Signup funnel** — Sign-in → account signup conversion: [https://us.posthog.com/project/483112/insights/qkj2jzSi](https://us.posthog.com/project/483112/insights/qkj2jzSi)
- **New account signups** — Daily bar chart of new accounts: [https://us.posthog.com/project/483112/insights/pbi7KpZj](https://us.posthog.com/project/483112/insights/pbi7KpZj)
- **Card lifecycle** — Daily line chart of cards created, closed, postponed: [https://us.posthog.com/project/483112/insights/Ff20MG72](https://us.posthog.com/project/483112/insights/Ff20MG72)
- **Board engagement** — Weekly board creation, publishing, and deletion: [https://us.posthog.com/project/483112/insights/kYDBQIxv](https://us.posthog.com/project/483112/insights/kYDBQIxv)
- **Account cancellations** — Weekly churn (account cancelled events): [https://us.posthog.com/project/483112/insights/7YVOnam6](https://us.posthog.com/project/483112/insights/7YVOnam6)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures. In particular, add `PostHog.stubs(:capture)` and `PostHog.stubs(:identify)` to any controller tests covering the instrumented actions.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the `posthog-js` snippet already calls `identify` on page load when `Current.user` is set, but verify this covers Turbo Drive navigations (the snippet re-runs on full page loads only; for Turbo-driven transitions consider re-identifying on `turbo:load`).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
