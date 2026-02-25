<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Native SaaS application. Here's a summary of what was implemented:

## What was added

### 1. PostHog SDK and dependencies installed
- `posthog-react-native` — the PostHog React Native SDK
- `react-native-config` — reads environment variables embedded at build time
- `react-native-device-info` — peer dependency for device context
- `react-native-localize` — peer dependency for locale context

### 2. Environment variables configured (`.env`)
`POSTHOG_API_KEY` and `POSTHOG_HOST` are stored in `.env` and loaded via `react-native-config`. These are **embedded at build time** — a rebuild is required after any `.env` change.

### 3. PostHog client created (`src/config/posthog.js`)
A singleton PostHog client is exported from `src/config/posthog.js`. It reads credentials from `react-native-config`, gracefully disables analytics if no API key is set, and enables app lifecycle event capture and debug mode in development.

### 4. PostHog provider and screen tracking added (`src/routes.js`)
- `PostHogProvider` is wrapped **inside** `NavigationContainer` (required for React Navigation v7)
- Automatic touch event capture (`captureTouches: true`) is enabled
- Manual screen tracking via `onStateChange` with `posthog.screen()` — this is required for React Navigation v7, which restricts navigation hooks to screen contexts
- `captureScreens: false` on the provider to prevent conflicts

### 5. User identification on sign-in (`src/store/modules/auth/sagas.js`)
- `posthog.identify(email, { $set, $set_once })` is called on successful sign-in to associate events with the user
- `posthog.reset()` is called on sign-out to clear the distinct ID

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `sign_in` | User successfully signed in | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Sign in attempt failed (invalid credentials) | `src/store/modules/auth/sagas.js` |
| `sign_out` | User signed out | `src/store/modules/auth/sagas.js` |
| `project_created` | User successfully created a new project | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | Project creation failed due to an API error | `src/store/modules/projects/sagas.js` |
| `team_created` | User successfully created a new team | `src/store/modules/teams/sagas.js` |
| `team_creation_failed` | Team creation failed due to an API error | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/components/TeamSwitcher/index.js` |
| `member_invited` | User successfully invited a new member | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | Member invite failed due to an API error | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated a team member's role | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | Updating a member role failed | `src/store/modules/members/sagas.js` |

## Next steps

Your PostHog project is ready to receive events. To complete setup:

### iOS — install native pods
```bash
cd ios && pod install && cd ..
```

### Android — configure react-native-config
Add the following to `android/app/build.gradle` to enable environment variables:
```gradle
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

### Build and run the app
```bash
# iOS
npm run ios

# Android
npm run android
```

### Recommended PostHog dashboard insights to create

Visit your [PostHog project](https://us.posthog.com/project/238460) and create an **"Analytics basics"** dashboard with these insights:

1. **User sign-in trend** — Trends insight on `sign_in` event (daily). Shows daily active user sign-ins.
2. **Onboarding funnel** — Funnel: `sign_in` → `team_selected` → `project_created`. Shows how many users complete the core onboarding flow after signing in.
3. **Team and project creation rate** — Trends insight comparing `team_created` and `project_created` events. Shows how actively users are setting up their workspace.
4. **Member collaboration** — Trends insight on `member_invited` and `member_role_updated`. Shows team growth and management activity.
5. **Authentication error rate** — Trends insight comparing `sign_in` vs `sign_in_failed`. Identifies login friction and potential security issues.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
