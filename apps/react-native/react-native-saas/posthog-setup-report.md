<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. The integration adds product analytics, user identification, autocapture (touch events), manual screen tracking, and error event capture throughout the app's critical user flows.

## Summary of Changes

### New Files Created
- **`src/config/posthog.js`** — PostHog client singleton using `react-native-config` to load API key and host from `.env` at build time. Configured with app lifecycle capture, autocapture, batching, and feature flag support.
- **`.env`** — Created with `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables (already covered by `.gitignore`).

### Modified Files

| File | Changes |
|------|---------|
| `src/routes.js` | Added `PostHogProvider` (inside `NavigationContainer` for React Navigation v7 compatibility), manual screen tracking via `onStateChange`/`onReady`, and touch autocapture |
| `src/store/modules/auth/sagas.js` | `posthog.identify()` on sign-in, `posthog.capture('user_signed_in')`, `posthog.capture('user_sign_in_failed')`, `posthog.capture('user_signed_out')`, `posthog.reset()` on sign-out |
| `src/store/modules/teams/sagas.js` | `posthog.capture('team_created')`, `posthog.capture('team_create_failed')`, `posthog.capture('team_selected')` |
| `src/store/modules/projects/sagas.js` | `posthog.capture('project_created')`, `posthog.capture('project_create_failed')` |
| `src/store/modules/members/sagas.js` | `posthog.capture('member_invited')`, `posthog.capture('member_invite_failed')`, `posthog.capture('member_role_updated')`, `posthog.capture('member_role_update_failed')` |

### Packages Installed
- `posthog-react-native` — Core PostHog React Native SDK
- `react-native-config` — Build-time environment variable injection
- `react-native-device-info` — Required peer dependency for device info
- `react-native-localize` — Required peer dependency for locale info

> **iOS note:** Run `cd ios && pod install && cd ..` to install native iOS dependencies after building.

## Event Tracking Table

| Event Name | Description | File |
|-----------|-------------|------|
| `user_signed_in` | User successfully signed in with email and password | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | User sign in attempt failed due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the application | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_create_failed` | Team creation failed | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project within a team | `src/store/modules/projects/sagas.js` |
| `project_create_failed` | Project creation failed | `src/store/modules/projects/sagas.js` |
| `member_invited` | User sent an invitation to a new team member | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | Member invitation failed | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Admin updated a team member's role | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | Member role update failed | `src/store/modules/members/sagas.js` |

## Next Steps

We've prepared a set of insights for you to create in your PostHog dashboard. Visit your project to set them up:

- **[PostHog Project](https://us.posthog.com/project/238460)** — Your project home
- **[Create Dashboard](https://us.posthog.com/project/238460/dashboards)** — Create an "Analytics basics" dashboard with these recommended insights:

### Recommended Insights

1. **Sign-In Conversion Funnel** — Funnel: `user_signed_in` → `team_selected` → `project_created`
2. **Authentication Events Over Time** — Trends: `user_signed_in`, `user_signed_out`, `user_sign_in_failed`
3. **Team & Project Creation** — Trends: `team_created`, `project_created`
4. **Member Management Activity** — Trends: `member_invited`, `member_role_updated`
5. **Error Events** — Trends: `user_sign_in_failed`, `team_create_failed`, `project_create_failed`, `member_invite_failed`, `member_role_update_failed`

> **Note:** Dashboard creation requires a PostHog Personal API key with `dashboard:write` scope. You can generate one at [PostHog API Keys Settings](https://us.posthog.com/settings/user-api-keys).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
