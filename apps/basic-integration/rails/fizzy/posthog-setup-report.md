<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. The posthog-ruby and posthog-rails gems were added, a PostHog initializer was created with automatic exception capture, ActiveJob instrumentation, and user context. Fifteen business events were instrumented across controllers covering the full user lifecycle — from signup through daily collaboration to account cancellation. Users are identified server-side on sign-in and signup, and a posthog-js snippet was added to the layout for frontend pageview and session replay tracking.

| Event | Description | File |
|---|---|---|
| `signup_completed` | User completes signup by providing their full name, creating a new account | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | User successfully authenticates via magic link and starts a new session | `app/controllers/sessions/magic_links_controller.rb` |
| `signed_out` | User explicitly signs out and terminates their session | `app/controllers/sessions_controller.rb` |
| `board_created` | User creates a new board to organize their work | `app/controllers/boards_controller.rb` |
| `board_deleted` | User deletes a board and all its cards | `app/controllers/boards_controller.rb` |
| `board_published` | User makes a board publicly accessible via a shareable link | `app/controllers/boards/publications_controller.rb` |
| `card_published` | User publishes a drafted card, making it visible on the board | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | User closes a card to mark it as done | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User postpones a card to the 'not now' list | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | User triages a card into a specific column on the board | `app/controllers/cards/triages_controller.rb` |
| `comment_created` | User adds a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `card_gilded` | User marks a card as golden/high-priority | `app/controllers/cards/goldnesses_controller.rb` |
| `account_cancelled` | Account owner cancels and deletes the account — critical churn event | `app/controllers/account/cancellations_controller.rb` |
| `account_imported` | User initiates an account import from another Fizzy instance | `app/controllers/account/imports_controller.rb` |
| `card_assigned` | User assigns or unassigns a team member to a card | `app/controllers/cards/assignments_controller.rb` |

## Next steps

The PostHog MCP did not have the required scopes (`dashboard:write`, `insight:write`, `query:read`) to create the dashboard automatically. Create it manually in PostHog using the events above. Suggested insights for an **"Analytics basics (wizard)"** dashboard:

1. **User signups over time** — Trends chart for `signup_completed` — [New insight](https://us.posthog.com/project/2/insights/new)
2. **Daily active users** — Trends chart for `signed_in` (unique users) — [New insight](https://us.posthog.com/project/2/insights/new)
3. **Signup → board created funnel** — Funnel with steps `signup_completed` → `board_created` — [New insight](https://us.posthog.com/project/2/insights/new)
4. **Account churn** — Trends chart for `account_cancelled` — [New insight](https://us.posthog.com/project/2/insights/new)
5. **Card throughput** — Trends chart with `card_published` and `card_closed` as two series — [New insight](https://us.posthog.com/project/2/insights/new)

[Dashboard list](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
