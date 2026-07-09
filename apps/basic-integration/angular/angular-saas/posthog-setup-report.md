<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Angular project with PostHog by installing `posthog-js`, adding a singleton `PostHogService`, wiring environment-based initialization into the existing app structure, capturing client-side product events across authentication, settings, project creation, and team management flows, and adding exception capture from the HTTP error interceptor. Environment variables were written locally to `.env`, a dashboard was created in PostHog, and five saved insights were added for the newly instrumented flows.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures successful user login after credentials are accepted and navigation begins. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Captures account logout after credentials are cleared and the session ends. | `src/app/auth/logout/logout.component.ts` |
| `profile_updated` | Captures successful profile edits when the profile form is saved. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Captures account settings saves from the settings area. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Captures notification settings saves after preference changes are submitted. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | Captures product preference saves including theme, timezone, and landing page choices. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_toggled` | Captures two-factor authentication being enabled or disabled from security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Captures revocation of an individual active session from security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `all_other_sessions_revoked` | Captures bulk revocation of all sessions except the current one. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `project_created` | Captures successful creation of a new project from the modal form. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Captures successful addition of a team member from the member modal. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825314
- Authentication activity (wizard): https://us.posthog.com/project/483112/insights/LFz7cP7G
- Settings changes funnel (wizard): https://us.posthog.com/project/483112/insights/6VWn3any
- Security actions breakdown (wizard): https://us.posthog.com/project/483112/insights/S8BSvW6I
- Project and team creation (wizard): https://us.posthog.com/project/483112/insights/SZ6NG7YO
- Profile and account saves (wizard): https://us.posthog.com/project/483112/insights/zosF9amL

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
