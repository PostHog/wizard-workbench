# PostHog post-wizard report

The wizard has completed a full PostHog integration for Fizzy. The `posthog-ruby` and `posthog-rails` gems were added and configured with automatic exception capture, ActiveJob instrumentation, and user context detection. A PostHog initializer was created, a `posthog-js` frontend snippet was added to the shared layout head partial (covering both the authenticated and public layouts), and 15 server-side events were instrumented across 11 controller files. Users are identified on sign-in (magic link) and account creation.

| Event name | Description | File |
|---|---|---|
| `identity_created` | A new user identity (email) was created during signup. | `app/controllers/signups_controller.rb` |
| `account_created` | A user completed signup and a new account/tenant was created. | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | A user successfully signed in via a magic link. | `app/controllers/sessions/magic_links_controller.rb` |
| `account_joined` | A user joined an account using an invite code. | `app/controllers/join_codes_controller.rb` |
| `board_created` | A new board was created in the account. | `app/controllers/boards_controller.rb` |
| `board_deleted` | A board was deleted from the account. | `app/controllers/boards_controller.rb` |
| `board_published` | A board was published publicly with a shareable link. | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A new card (task/issue) was created on a board. | `app/controllers/cards_controller.rb` |
| `card_closed` | A card was marked as closed/completed. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A previously closed card was reopened. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | A card was moved to 'not now' / postponed. | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | A comment was added to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | A card was assigned to a user. | `app/controllers/cards/assignments_controller.rb` |
| `card_gilded` | A card was marked as golden/high-priority. | `app/controllers/cards/goldnesses_controller.rb` |
| `account_cancelled` | An account was cancelled and deleted (churn event). | `app/controllers/account/cancellations_controller.rb` |

## Next steps

The PostHog API key used by the MCP is missing `dashboard:write`, `insight:write`, and `query:read` scopes, so the dashboard could not be created automatically. To set it up manually, navigate to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and create a dashboard named **"Analytics basics (wizard)"** with the following insights:

1. **Signup funnel** — Funnel insight: `identity_created` → `account_created` → `user_signed_in`
2. **Daily active users** — Trends insight: `user_signed_in` (unique users, daily)
3. **Cards completed over time** — Trends insight: `card_closed` (event count, weekly)
4. **Churn** — Trends insight: `account_cancelled` (event count, monthly)
5. **Collaboration activity** — Trends insight: `comment_created` + `card_assigned` side-by-side

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the frontend `posthog.identify()` in `_head.html.erb` fires on every page load for authenticated users, which covers returning sessions correctly; verify this in the browser by checking the Network tab for PostHog identify calls.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
