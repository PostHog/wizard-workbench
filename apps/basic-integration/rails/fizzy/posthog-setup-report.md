<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy, a Rails-based kanban project management app. The integration adds server-side event tracking via `posthog-ruby` and `posthog-rails` (with automatic exception capture and ActiveJob instrumentation), user identification on login and signup completion, and a frontend `posthog-js` snippet for pageview tracking and session replay.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User submits a valid email to start signup (identity creation) | `app/controllers/signups_controller.rb` |
| `signup_completed` | User finishes account setup with their full name; account is created | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | User successfully authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | User signs out and session is terminated | `app/controllers/sessions_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `card_created` | User creates a new card on a board (JSON/API path) | `app/controllers/cards_controller.rb` |
| `card_closed` | User closes (completes) a card | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User manually postpones a card to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | User adds a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner cancels and deletes the account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

The PostHog API key used in this environment is missing the `query:read`, `insight:write`, and `dashboard:write` scopes needed to create insights and dashboards automatically. Please create the **"Analytics basics (wizard)"** dashboard manually in PostHog with these recommended insights:

1. **Signup funnel** — Funnel from `user_signed_up` → `signup_completed` → `board_created` → `card_created` to track onboarding conversion.
2. **Daily active users** — Trend of `user_logged_in` over time (unique users) to measure engagement.
3. **Card completion rate** — Trend comparing `card_created` vs `card_closed` to track task completion.
4. **Churn signals** — Trend of `card_postponed` and `account_cancelled` over time.
5. **Collaboration activity** — Trend of `comment_created` over time to track collaboration engagement.

Visit [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) to create these.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the frontend `posthog.identify` in `_head.html.erb` handles this for authenticated page loads, but verify it fires correctly after Turbo navigation.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
