<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your React Native SaaS project with PostHog analytics. Here's a summary of all changes made:

## What was set up

- **`src/config/posthog.js`** — New PostHog client instance configured via `react-native-config` (reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` at build time). Includes `captureAppLifecycleEvents`, debug mode, and batching options.
- **`src/routes.js`** — `PostHogProvider` added inside `NavigationContainer` for React Navigation v7 compatibility. Touch autocapture is enabled. Manual screen tracking via `posthog.screen()` fires on route changes.
- **`src/store/modules/auth/sagas.js`** — User identification (`posthog.identify()`) on sign-in, `user_signed_in`, `user_signed_out`, and `sign_in_failed` events. `posthog.reset()` called on sign-out to clear the identified user. Exception capture on sign-in errors.
- **`src/components/NewTeam/index.js`** — `team_created` event with team name.
- **`src/components/TeamSwitcher/index.js`** — `team_selected` event with team ID and name.
- **`src/components/NewProject/index.js`** — `project_created` event with project title.
- **`src/components/InviteMember/index.js`** — `member_invited` event with invitee email.
- **`src/components/RoleUpdater/index.js`** — `member_role_updated` event with member ID, role name, and whether the role was granted or revoked.
- **`.env`** — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` added.

## Packages installed

```
posthog-react-native
react-native-device-info
react-native-localize
react-native-svg
react-native-config
```

> **Note for iOS:** After installing, run `cd ios && pod install` to link native dependencies.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in to the app | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the app | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User attempted to sign in but credentials were invalid | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team | `src/components/NewTeam/index.js` |
| `team_selected` | User switched to a different team | `src/components/TeamSwitcher/index.js` |
| `project_created` | User created a new project within the active team | `src/components/NewProject/index.js` |
| `member_invited` | User invited a new member to the team | `src/components/InviteMember/index.js` |
| `member_role_updated` | Administrator updated a member's role within the team | `src/components/RoleUpdater/index.js` |

## Next steps

Visit your PostHog project to see the incoming events and build insights:

- **PostHog project:** https://us.posthog.com/project/2

### Suggested insights to build

1. **Sign-in funnel** — Trend of `user_signed_in` vs `sign_in_failed` to monitor auth health
2. **Team adoption** — Trend of `team_created` and `team_selected` to track multi-team usage
3. **Project creation rate** — Trend of `project_created` grouped by team
4. **Member growth** — Trend of `member_invited` and `member_role_updated`
5. **Churn indicator** — `user_signed_out` vs `user_signed_in` ratio over time

### Dashboard

Create an "Analytics basics" dashboard in PostHog and add the insights above. All event names are exactly as listed in the table above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
