<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. Here is a summary of all changes made:

**New file created:**
- `src/config/posthog.js` — PostHog singleton client, configured from `.env` environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`). Includes `captureAppLifecycleEvents`, debug mode, and sensible batching defaults. Analytics are gracefully disabled when no token is configured.

**Modified files:**
- `src/routes.js` — Wrapped the navigation stack with `PostHogProvider` (placed inside `NavigationContainer` for React Navigation v7 compatibility). Added manual screen tracking via `onReady` / `onStateChange` callbacks. Touch event autocapture enabled via `captureTouches: true`.
- `src/store/modules/auth/sagas.js` — Added `posthog.identify()` on successful sign-in to link events to a known user, plus `user_signed_in`, `user_sign_in_failed`, and `user_signed_out` events. `posthog.reset()` is called on sign-out to clear the anonymous ID.
- `src/store/modules/teams/sagas.js` — Added `team_created` and `team_switched` events, plus error tracking via `$exception` on team creation failure.
- `src/store/modules/projects/sagas.js` — Added `project_created` event and error tracking on project creation failure.
- `src/store/modules/members/sagas.js` — Added `member_invited` and `member_role_updated` events, plus error tracking on both failure paths.

**Environment variables set** in `.env`:
- `POSTHOG_PROJECT_TOKEN`
- `POSTHOG_HOST`

**Packages installed:**
- `posthog-react-native` — core SDK
- `react-native-config` — reads `.env` at build time
- `react-native-svg` — required peer dependency (surveys feature)
- `react-native-device-info` — required peer dependency
- `react-native-localize` — required peer dependency

> **iOS note:** Run `cd ios && pod install && cd ..` after this integration to link the new native dependencies.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in (email + `demo_mode` flag) | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | Sign-in attempt failed due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User explicitly signs out | `src/store/modules/auth/sagas.js` |
| `team_created` | User creates a new team (`team_name`, `team_id`) | `src/store/modules/teams/sagas.js` |
| `team_switched` | User switches to a different active team (`team_name`, `team_id`, `team_slug`) | `src/store/modules/teams/sagas.js` |
| `project_created` | User creates a new project (`project_title`, `project_id`) | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invites a member by email (`invited_email`) | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Admin updates a member's roles (`member_id`, `role_names`) | `src/store/modules/members/sagas.js` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Sign-in trend** — Trends chart for `user_signed_in` over time, broken down by `demo_mode`.
2. **Sign-in conversion funnel** — Funnel from `user_signed_in` → `team_switched` → `project_created` to measure activation.
3. **Churn signal** — Trends chart comparing `user_signed_in` vs `user_signed_out` over time.
4. **Team & project growth** — Stacked trends chart for `team_created` and `project_created`.
5. **Viral coefficient** — Trends chart for `member_invited` — tracks organic growth from invitations.

Visit your PostHog project to create this dashboard: [Dashboards](/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
