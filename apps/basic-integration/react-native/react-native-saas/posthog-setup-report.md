<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. The following changes were made:

- **Installed** `posthog-react-native`, `react-native-config`, and `react-native-svg` packages.
- **Created** `src/config/posthog.js` — initialises the PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` via `react-native-config`.
- **Modified** `src/routes.js` — wrapped the navigator in `PostHogProvider` (placed inside `NavigationContainer` for React Navigation v7 compatibility), enabled touch autocapture, and added manual screen tracking via `onStateChange`.
- **Modified** `src/store/modules/auth/sagas.js` — added `posthog.identify()` and `user_signed_in` capture on successful sign-in (both real and demo mode); added `user_signed_out` capture and `posthog.reset()` on sign-out.
- **Modified** `src/store/modules/projects/sagas.js` — added `project_created` capture on success; added `captureException` on failure.
- **Modified** `src/store/modules/teams/sagas.js` — added `team_created` capture on success and `team_selected` capture when switching teams; added `captureException` on create failure.
- **Modified** `src/store/modules/members/sagas.js` — added `member_invited` capture on success and `member_role_updated` capture on role change; added `captureException` on failures.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully authenticates and signs into the app. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Fired when a user signs out of the app and their session is cleared. | `src/store/modules/auth/sagas.js` |
| `project_created` | Fired when a user successfully creates a new project within their team. | `src/store/modules/projects/sagas.js` |
| `team_created` | Fired when a user successfully creates a new team. | `src/store/modules/teams/sagas.js` |
| `team_selected` | Fired when a user switches to a different team. | `src/store/modules/teams/sagas.js` |
| `member_invited` | Fired when a user invites a new member to their team. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Fired when a user updates the role of an existing team member. | `src/store/modules/members/sagas.js` |

## Next steps

Dashboard creation requires `dashboard:write` and `insight:write` scopes on the PostHog API key. To create the recommended dashboard manually, go to PostHog → Dashboards → New dashboard, name it **"Analytics basics (wizard)"**, and add these 5 insights:

1. **Sign-in volume (DAU)** — Trend of `user_signed_in` events over time.
2. **Activation funnel** — Funnel: `user_signed_in` → `team_selected` → `project_created`.
3. **Project creation over time** — Trend of `project_created` events.
4. **Member invitations (virality)** — Trend of `member_invited` events.
5. **Team creation over time** — Trend of `team_created` events.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `init()` saga restores the token but does not re-identify the user in PostHog; consider calling `posthog.identify(email)` after restoring a session if the email is available.
- [ ] For iOS: run `cd ios && pod install` after the new native packages are added.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
