<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. The integration covers backend event tracking via the `posthog-ruby` and `posthog-rails` gems, user identification across authentication flows, automatic exception capture, and a posthog-js frontend snippet for client-side analytics and session replay.

**Files created:**
- `config/initializers/posthog.rb` — PostHog initializer with auto-exception capture, ActiveJob instrumentation, and user context
- `.env` — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables

**Files modified:**
- `Gemfile` — Added `posthog-ruby` and `posthog-rails` gems
- `app/models/user.rb` — Added `posthog_distinct_id` and `posthog_properties` methods
- `app/controllers/application_controller.rb` — Added `current_user` helper (delegates to `Current.user`)
- `app/views/layouts/shared/_head.html.erb` — Added posthog-js snippet with CSP nonce and user identify on page load
- 13 controller files — PostHog event capture and identify calls

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | New user completes account signup | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | User authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_logged_out` | User terminates their session | `app/controllers/sessions_controller.rb` |
| `user_joined_via_invite` | User redeems a join code to join an account | `app/controllers/join_codes_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | User deletes a board | `app/controllers/boards_controller.rb` |
| `card_created` | User creates a new card via the JSON API | `app/controllers/cards_controller.rb` |
| `card_deleted` | User deletes a card | `app/controllers/cards_controller.rb` |
| `card_closed` | User closes a card (marks it done) | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopens a previously closed card | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User postpones a card to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | User moves a card from triage into a workflow column | `app/controllers/cards/triages_controller.rb` |
| `card_commented` | User posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | User assigns a team member on a card | `app/controllers/cards/assignments_controller.rb` |
| `account_cancelled` | Account owner cancels and deletes their account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

The PostHog API key used during setup did not have the `dashboard:write` and `insight:write` scopes required to programmatically create a dashboard. To create the recommended "Analytics basics (wizard)" dashboard, visit your PostHog project and manually create insights for:

1. **Signup funnel** — Funnel from `user_logged_in` → `board_created` → `card_created` (new user onboarding conversion)
2. **Active users trend** — Trends on `user_logged_in` over time (DAU/WAU)
3. **Card lifecycle** — Trends on `card_created`, `card_closed`, `card_postponed` overlaid to see completion vs. deferral rates
4. **Churn signal** — Trends on `account_cancelled` over time
5. **Collaboration activity** — Trends on `card_commented` and `card_assigned` over time

Add these to a dashboard named **"Analytics basics (wizard)"** at [https://us.posthog.com/project/2](https://us.posthog.com/project/2).

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures. In test mode PostHog queues but does not send events (`config.test_mode = true`), but any spec that stubs controller actions may need to account for the new `PostHog.capture` / `PostHog.identify` calls.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (and any bootstrap scripts) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the posthog-js snippet in `_head.html.erb` calls `posthog.identify` on every page load when `Current.user` is set, which covers returning sessions. Verify this works end-to-end after login.
- [ ] The posthog-js CDN (`*-assets.i.posthog.com`) loads a dynamically-inserted `<script>` tag. If the app enforces a strict `script-src` CSP, add `https://*-assets.i.posthog.com` to `CSP_SCRIPT_SRC` and `https://*.i.posthog.com` to `CSP_CONNECT_SRC` in your deployment environment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
