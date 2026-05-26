<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy. Here's what was added:

- **posthog-ruby** and **posthog-rails** gems installed for server-side analytics and automatic error capture
- **posthog-js** snippet added to the shared layout head for frontend pageview tracking and session replay
- **PostHog initializer** created at `config/initializers/posthog.rb` with automatic exception capture, ActiveJob instrumentation, and user context detection
- **`posthog_distinct_id` and `posthog_properties`** added to the `User` model so posthog-rails can automatically associate errors with the authenticated user
- **`current_user` helper** added to `ApplicationController` delegating to `Current.user` for posthog-rails auto-detection
- **User identification** via `PostHog.identify` at login (magic link auth) and signup completion, and via `posthog.identify()` in the frontend for authenticated sessions
- **14 server-side events** instrumented across 11 controller files covering the full Fizzy user lifecycle

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user completes account signup | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | User authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | Board is permanently deleted | `app/controllers/boards_controller.rb` |
| `board_published` | Board is made publicly accessible | `app/controllers/boards/publications_controller.rb` |
| `card_created` | New card is published on a board | `app/controllers/cards/publishes_controller.rb`, `app/controllers/cards_controller.rb` |
| `card_closed` | Card is marked as closed/completed | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Card is manually moved to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | Card is moved from triage into a workflow column | `app/controllers/cards/triages_controller.rb` |
| `comment_added` | User adds a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | Card is assigned to a team member | `app/controllers/cards/assignments_controller.rb` |
| `user_joined_via_invite` | User redeems an invite join code | `app/controllers/join_codes_controller.rb` |
| `account_cancelled` | Account owner cancels the account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

To set up an **"Analytics basics"** dashboard in PostHog, go to [Dashboards](/dashboard) and create a new dashboard with these suggested insights:

1. **Signup funnel** — Funnel insight: `user_logged_in` → `user_signed_up` → `board_created` → `card_created`. Shows where users drop off in the onboarding flow.
2. **Weekly signups trend** — Trends insight on `user_signed_up` over time. Track growth momentum.
3. **Card completion rate** — Trends insight comparing `card_created` vs `card_closed` counts. Shows how productive users are with their cards.
4. **Churn signal** — Trends insight on `account_cancelled`. Monitor cancellation events to catch churn spikes early.
5. **Engagement depth** — Trends insight on `comment_added` and `card_assigned` broken down by user. Identifies your most active collaborators.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
