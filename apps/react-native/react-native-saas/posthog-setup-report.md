<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Native SaaS application. The integration includes:

- **PostHog SDK Setup**: Created `src/config/posthog.js` with the PostHog client configuration using environment variables from `react-native-config`
- **Provider Integration**: Modified `src/routes.js` to include `PostHogProvider` inside `NavigationContainer` with manual screen tracking for React Navigation v7
- **User Identification**: Added `posthog.identify()` calls during sign-in to associate events with specific users, and `posthog.reset()` on sign-out
- **Event Tracking**: Implemented custom event capture across all major user actions (authentication, team management, project management, member management)
- **Error Tracking**: Added `$exception` event capture for all error scenarios to enable PostHog error tracking
- **Environment Variables**: Configured `.env` with `POSTHOG_API_KEY` and `POSTHOG_HOST` for secure API key management

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_in` | User successfully signed in to the app | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the app | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User failed to sign in due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `team_creation_failed` | Failed to create a new team | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project within a team | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | Failed to create a new project | `src/store/modules/projects/sagas.js` |
| `member_invited` | User sent an invitation to a new team member | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated the role of a team member | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | Failed to send member invitation | `src/store/modules/members/sagas.js` |
| `member_update_failed` | Failed to update member role | `src/store/modules/members/sagas.js` |

## Dependencies Added

- `posthog-react-native` - PostHog React Native SDK
- `react-native-device-info` - Device information for better analytics
- `react-native-localize` - Localization support for PostHog
- `react-native-config` - Environment variable management

## Next steps

### For iOS
After adding PostHog, ensure pods are installed:
```bash
cd ios && pod install && cd ..
```

### For Android
Native linking should be automatic with React Native 0.83.0. If you encounter issues, run:
```bash
cd android && ./gradlew clean && cd ..
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Files Modified/Created

| File | Action |
|------|--------|
| `src/config/posthog.js` | Created - PostHog client configuration |
| `src/routes.js` | Modified - Added PostHogProvider and screen tracking |
| `src/store/modules/auth/sagas.js` | Modified - Added identify, sign-in/out events, error tracking |
| `src/store/modules/teams/sagas.js` | Modified - Added team events and error tracking |
| `src/store/modules/projects/sagas.js` | Modified - Added project events and error tracking |
| `src/store/modules/members/sagas.js` | Modified - Added member events and error tracking |
| `.env` | Created - PostHog API key and host configuration |

</wizard-report>
