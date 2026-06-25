<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. The integration adds `posthog-react-native` with `react-native-config` for env-var-driven configuration, a `PostHogProvider` wired inside the `NavigationContainer` for React Navigation v7 compatibility, and manual screen tracking. Seven business-critical events are now captured across authentication, team management, project creation, and member management — all via direct posthog client calls in Redux Saga handlers.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated and signed in to the app. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the app, clearing their session. | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team workspace. | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different active team. | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project within the active team. | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to join the team. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Admin updated the roles assigned to a team member. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1760658)
- [Daily Sign-ins](https://us.posthog.com/project/483112/insights/o9YeQgAv)
- [Sign-in to Project Created Funnel](https://us.posthog.com/project/483112/insights/zTb7sAUE)
- [Member Invitations Over Time](https://us.posthog.com/project/483112/insights/IJ1OZaP9)
- [Teams Created Over Time](https://us.posthog.com/project/483112/insights/iJabU7LE)
- [User Sign-outs (Churn Signal)](https://us.posthog.com/project/483112/insights/TU90dwyw)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] For iOS, run `pod install` in the `ios/` directory after installing `posthog-react-native`, `react-native-config`, and `react-native-svg` — native linking is required for bare React Native.
- [ ] For Android, follow the `react-native-config` Android setup (add `apply from: "../../node_modules/react-native-config/android/react-native-config.gradle"` to `android/app/build.gradle`) so env vars are embedded in the Android build.
- [ ] Confirm the returning-visitor path also calls `identify` — the `init` saga re-identifies on session restore, but verify this path runs correctly after app restart.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
