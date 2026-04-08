<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. The following changes were made:

- **`src/config/posthog.js`** (new file): PostHog singleton client using `react-native-config` to load credentials from `.env`. Gracefully disables itself if no token is present.
- **`src/routes.js`**: Wrapped the navigator with `PostHogProvider` (inside `NavigationContainer`, as required for React Navigation v7). Adds manual screen tracking with `posthog.screen()` on navigation state changes, and touch autocapture.
- **`src/store/modules/auth/sagas.js`**: Identifies users on sign-in (`posthog.identify()`), captures `user signed in` and `user signed out` events, calls `posthog.reset()` on sign-out, and captures `$exception` events on auth errors.
- **`src/store/modules/teams/sagas.js`**: Captures `team created` and `team selected` events with team name/id properties, and `$exception` on errors.
- **`src/store/modules/projects/sagas.js`**: Captures `project created` event with title/id properties, and `$exception` on errors.
- **`src/store/modules/members/sagas.js`**: Captures `member invited` and `member role updated` events with relevant properties, and `$exception` on errors.

| Event name | Description | File |
|---|---|---|
| `user signed in` | User successfully signs in (demo or real) | `src/store/modules/auth/sagas.js` |
| `user signed out` | User signs out and session is cleared | `src/store/modules/auth/sagas.js` |
| `team created` | A new team is successfully created | `src/store/modules/teams/sagas.js` |
| `team selected` | User switches to or selects a team | `src/store/modules/teams/sagas.js` |
| `project created` | A new project is created within a team | `src/store/modules/projects/sagas.js` |
| `member invited` | A member is invited to a team | `src/store/modules/members/sagas.js` |
| `member role updated` | A member's role is changed within a team | `src/store/modules/members/sagas.js` |

## Next steps

We've instrumented your app with the key business events above. To visualize them, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Daily sign-ins** — Trends chart for `user signed in` over time
2. **Team creation funnel** — Funnel: `user signed in` → `team created` → `project created` (activation funnel)
3. **Project creation rate** — Trends chart for `project created` grouped by day/week
4. **Member invitations** — Trends chart for `member invited` over time (growth/virality signal)
5. **Churn signal** — Trends chart for `user signed out` — spikes may indicate friction

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
