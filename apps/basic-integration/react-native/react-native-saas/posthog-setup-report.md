# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the React Native SaaS app. The integration includes:

- **PostHog client** (`src/config/posthog.js`) initialized with `react-native-config` environment variables, app lifecycle tracking, and autocapture enabled.
- **PostHogProvider** added to `src/routes.js` inside `NavigationContainer`, with manual screen tracking for React Navigation v7 compatibility.
- **User identification** via `posthog.identify()` on sign in (both demo and real), and `posthog.reset()` on sign out.
- **12 custom events** across 4 saga files covering authentication, team management, project creation, and member operations.
- **Error tracking** via `posthog.captureException()` on all failure paths.

| Event | Description | File |
|-------|-------------|------|
| `sign_in` | User successfully signs in to the app | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User sign in attempt failed due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `sign_out` | User signs out of the app | `src/store/modules/auth/sagas.js` |
| `project_created` | User successfully creates a new project | `src/store/modules/projects/sagas.js` |
| `project_create_failed` | User attempt to create a project failed | `src/store/modules/projects/sagas.js` |
| `team_created` | User successfully creates a new team | `src/store/modules/teams/sagas.js` |
| `team_create_failed` | User attempt to create a team failed | `src/store/modules/teams/sagas.js` |
| `team_switched` | User switches to a different team | `src/store/modules/teams/sagas.js` |
| `member_invited` | User successfully invites a new member to the team | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | User attempt to invite a member failed | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User successfully updates a team member's role | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | User attempt to update a member role failed | `src/store/modules/members/sagas.js` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Sign In Trend** — Daily trend of `sign_in` events to track user engagement.
   [Create insight](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"sign_in","math":"total","type":"events"}],"insight":"TRENDS","date_from":"-30d"})

2. **Sign In Funnel** — Conversion funnel from app open through `sign_in` to catch drop-offs.
   [Create insight](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"$pageview","order":0,"type":"events"},{"id":"sign_in","order":1,"type":"events"}],"insight":"FUNNELS","date_from":"-30d"})

3. **Project & Team Creation** — Trend of `project_created` and `team_created` to monitor growth.
   [Create insight](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"project_created","math":"total","type":"events"},{"id":"team_created","math":"total","type":"events"}],"insight":"TRENDS","date_from":"-30d"})

4. **Member Invitations** — Trend of `member_invited` to track virality and team growth.
   [Create insight](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"member_invited","math":"total","type":"events"}],"insight":"TRENDS","date_from":"-30d"})

5. **Authentication Failures & Churn** — Trend of `sign_in_failed` and `sign_out` events to monitor friction and churn.
   [Create insight](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"sign_in_failed","math":"total","type":"events"},{"id":"sign_out","math":"total","type":"events"}],"insight":"TRENDS","date_from":"-30d"})

[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
