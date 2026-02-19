<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Native SaaS application. The integration covers:

- **Package installation**: `posthog-react-native`, `react-native-device-info`, `react-native-localize`, and `react-native-config` have been added as dependencies.
- **Environment variables**: `POSTHOG_API_KEY` and `POSTHOG_HOST` are stored in `.env` via `react-native-config` and never hardcoded.
- **PostHog client config** (`src/config/posthog.js`): A singleton PostHog instance is initialised with app lifecycle capture, autocapture for touches, and dev-mode disabling via `__DEV__`.
- **Provider setup** (`src/routes.js`): `PostHogProvider` is placed inside `NavigationContainer` as required by React Navigation v7. Manual screen tracking (`posthog.screen()`) is wired into `onStateChange` since React Navigation v7 restricts navigation hooks from outside screens.
- **User identification**: `posthog.identify()` is called on successful sign-in, associating all subsequent events to the authenticated user. `posthog.reset()` is called on sign-out to clear the distinct ID.
- **Event tracking**: 8 key business events are captured across 4 saga files.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in with email and password | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Sign-in attempt failed due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the application | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User sent an invitation to a new team member | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated a team member's role | `src/store/modules/members/sagas.js` |

## Next steps

We've prepared an **"Analytics basics"** dashboard for you to create in PostHog with the following 5 insights based on the events instrumented above:

1. **Sign-In Conversion Funnel** — Funnel from `sign_in_failed` → `user_signed_in` to track login success rate
2. **Daily Sign-Ins** — Trend of `user_signed_in` events per day (DAU signal)
3. **Team & Project Creation** — Trend of `team_created` and `project_created` over time (activation signal)
4. **Member Invitations** — Trend of `member_invited` per day (growth/virality signal)
5. **Daily Sign-Outs (Churn Signal)** — Trend of `user_signed_out` per day

Create your dashboard here: [https://us.posthog.com/project/2/dashboard/new](https://us.posthog.com/project/2/dashboard/new)

### iOS native setup

Since this is a bare React Native project, you'll need to run `pod install` in the `ios/` directory on a macOS machine after installing the new native packages:

```bash
cd ios && pod install
```

The following native packages were added and require linking:
- `react-native-config` — needs build phase script in Xcode and Android `apply from` in build.gradle
- `react-native-device-info` — auto-linked in React Native 0.60+
- `react-native-localize` — auto-linked in React Native 0.60+

For `react-native-config`, follow the [setup guide](https://github.com/luggit/react-native-config#setup) to add the build phase script to your iOS target and enable the `.env` file to be read at build time.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
