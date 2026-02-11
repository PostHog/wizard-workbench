# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Native SaaS application. The integration includes:

- **PostHog React Native SDK** (`posthog-react-native`) with all required peer dependencies
- **PostHogProvider** configuration with React Navigation v7 manual screen tracking
- **User identification** on sign in with person properties (`$set` and `$set_once`)
- **User session reset** on sign out to properly separate anonymous users
- **Custom event tracking** for all business-critical actions
- **Error tracking** with `$exception` events for all API failures
- **Environment variables** configured via `react-native-config` for secure API key management

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_in` | User successfully signed in to the application | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the application | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User failed to sign in (invalid credentials) | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_creation_failed` | User failed to create a team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | User failed to create a project | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to the team | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | User failed to invite a member | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated a team member's role | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | User failed to update a member's role | `src/store/modules/members/sagas.js` |

## Files Modified/Created

| File | Change |
|------|--------|
| `src/config/posthog.js` | **Created** - PostHog client configuration with environment variables |
| `src/routes.js` | **Modified** - Added PostHogProvider with manual screen tracking for React Navigation v7 |
| `src/store/modules/auth/sagas.js` | **Modified** - Added user identification, sign in/out events, and error tracking |
| `src/store/modules/teams/sagas.js` | **Modified** - Added team creation and selection events with error tracking |
| `src/store/modules/projects/sagas.js` | **Modified** - Added project creation events with error tracking |
| `src/store/modules/members/sagas.js` | **Modified** - Added member invitation and role update events with error tracking |
| `.env` | **Created** - Environment variables for PostHog API key and host |

## Next steps

### Creating a Dashboard

To create an "Analytics basics" dashboard in PostHog with the events instrumented:

1. Go to your PostHog project at https://us.i.posthog.com
2. Navigate to **Dashboards** and click **New dashboard**
3. Name it "Analytics basics"
4. Add the following recommended insights:

**Suggested Insights:**

1. **Sign-in Conversion Funnel**: Track users from sign-in attempts to successful sign-ins
   - Events: `user_signed_in` (success) vs `sign_in_failed` (failures)

2. **Team & Project Adoption**: Track team and project creation trends
   - Events: `team_created`, `project_created`

3. **User Engagement**: Track team selections and member management
   - Events: `team_selected`, `member_invited`, `member_role_updated`

4. **Error Rate Tracking**: Monitor failure events over time
   - Events: `sign_in_failed`, `team_creation_failed`, `project_creation_failed`, `member_invite_failed`, `member_role_update_failed`

5. **Active Users**: Track unique users performing key actions
   - Unique users who triggered any custom event

### iOS Setup

For iOS, install the pods after adding PostHog:

```bash
cd ios && pod install && cd ..
```

### Android Setup

For Android, the native modules should be linked automatically. Make sure to:

1. Add the following to `android/app/build.gradle` if not already present:
   ```gradle
   apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
   ```

2. Clean and rebuild:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
