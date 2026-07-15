# PostHog post-wizard report

PostHog server-side analytics has been added to this Rails application. The integration configures the Rails SDK from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables automatic controller exception capture and ActiveJob failure instrumentation, and identifies authenticated users with stable `user_<id>` distinct IDs. Person properties, including email, are sent only through `identify` and never as event properties.

The PostHog gems were added to the Gemfile, but their installation could not be completed because the available command runner blocked Bundler commands. Run `bundle install` locally before merging. The PostHog MCP server was unavailable, so the dashboard and shareable notebook could not be created in this run.

| Event name | Description | File |
| --- | --- | --- |
| `signup_completed` | Tracks completion of a new account signup. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | Tracks creation of a board within an account. | `app/controllers/boards_controller.rb` |
| `card_published` | Tracks publication of a card from its draft state. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | Tracks closure of a card. | `app/controllers/cards/closures_controller.rb` |
| `comment_created` | Tracks a comment added to a card. | `app/controllers/cards/comments_controller.rb` |
| `webhook_created` | Tracks configuration of a board webhook. | `app/controllers/webhooks_controller.rb` |

## Next steps

- Dashboard: not created because the PostHog MCP server was unavailable.
- Insights: not created because the PostHog MCP server was unavailable.
- Notebook: not created because the PostHog MCP server was unavailable.

## Verify before merging

- [ ] Run `bundle install` to resolve the newly added PostHog gems and update the lockfile.
- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in the project for future PostHog integration work.
