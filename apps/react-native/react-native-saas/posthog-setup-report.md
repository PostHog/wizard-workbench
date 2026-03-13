<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Native SaaS application.

**What was done:**

- Installed `posthog-react-native`, `react-native-config`, `react-native-svg`, `react-native-device-info`, and `react-native-localize`
- Created `src/config/posthog.js` — PostHog client configured via environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) using `react-native-config`
- Updated `src/routes.js` — added `PostHogProvider` inside `NavigationContainer` (required for React Navigation v7), with manual screen tracking via `onReady`/`onStateChange` callbacks and autocapture (touch events enabled, screen capture disabled)
- Set environment variables in `.env` (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`)
- Added 8 custom events across 4 saga files, with user identification on sign-in and `posthog.reset()` on sign-out
- Added `$exception` error tracking in `auth`, `teams`, `projects`, and `members` saga catch blocks

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Fired when a user signs out | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Fired when a sign-in attempt fails | `src/store/modules/auth/sagas.js` |
| `team_created` | Fired when a user successfully creates a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | Fired when a user switches to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | Fired when a user successfully creates a new project | `src/store/modules/projects/sagas.js` |
| `member_invited` | Fired when a member is invited to a team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Fired when a member's role is updated | `src/store/modules/members/sagas.js` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Sign-in trend** — Trends › `user_signed_in` over time
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_in"}]})

2. **Sign-in funnel (sign-in to team selection)** — Funnels › `user_signed_in` → `team_selected`
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_in"},{"id":"team_selected"}]})

3. **Failed sign-in rate** — Trends › `sign_in_failed` vs `user_signed_in`
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"sign_in_failed"},{"id":"user_signed_in"}]})

4. **Team & project creation** — Trends › `team_created` + `project_created`
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"team_created"},{"id":"project_created"}]})

5. **Member growth (invites)** — Trends › `member_invited`
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"member_invited"}]})

**Dashboard:** [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)

### Native linking reminder

Since this is a React Native project (not Expo), native dependencies require linking:

- **iOS:** Run `cd ios && pod install` after installing the packages
- **Android:** Clean and rebuild: `cd android && ./gradlew clean`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
