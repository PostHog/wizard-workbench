# PostHog post-wizard report

The wizard completed a Rails-focused PostHog integration for Fizzy by adding the PostHog Ruby and Rails gems to the Gemfile, creating a Rails initializer with automatic exception and ActiveJob instrumentation, exposing PostHog configuration and identified-user metadata to the frontend layout, and initializing posthog-js from importmap-managed JavaScript. It also added server-side event capture across signup, board creation, card creation, export, import, webhook, and profile update flows while reusing application user/account context through `posthog_distinct_id` and `posthog_properties`.

| Event name | Description | File |
| --- | --- | --- |
| magic_link_requested | Captures when an email-based sign-in or sign-up magic link is requested. | `app/controllers/sessions_controller.rb` |
| signup_started | Captures when a visitor submits the signup form to begin account creation. | `app/controllers/signups_controller.rb` |
| signup_completed | Captures when a signed-in identity completes account setup successfully. | `app/models/signup.rb` |
| board_created | Captures when a user creates a new board. | `app/controllers/boards_controller.rb` |
| card_created | Captures when a user creates a new card. | `app/controllers/cards_controller.rb` |
| profile_updated | Captures when a user successfully updates their profile. | `app/controllers/users_controller.rb` |
| data_export_requested | Captures when a user requests a personal data export. | `app/controllers/users/data_exports_controller.rb` |
| account_export_requested | Captures when an admin or owner requests an account export. | `app/controllers/account/exports_controller.rb` |
| account_import_started | Captures when an authenticated identity starts an account import. | `app/controllers/account/imports_controller.rb` |
| webhook_created | Captures when a board webhook is created. | `app/controllers/webhooks_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846821)
- [Signup completions (wizard)](https://us.posthog.com/project/483112/insights/zIeRy9yJ)
- [Signup funnel (wizard)](https://us.posthog.com/project/483112/insights/5gaALjBJ)
- [Boards created over time (wizard)](https://us.posthog.com/project/483112/insights/00sd3lae)
- [Cards created over time (wizard)](https://us.posthog.com/project/483112/insights/PlXtVCCj)
- [Exports requested (wizard)](https://us.posthog.com/project/483112/insights/FWhG6ZBq)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in the project at `.claude/skills/integration-ruby-on-rails/`. It can be reused in future Claude Code runs to keep PostHog integration work aligned with the latest Rails guidance.
