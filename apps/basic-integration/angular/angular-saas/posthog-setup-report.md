# PostHog post-wizard report

The wizard installed `posthog-js`, added an Angular root singleton service, initialized analytics from `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`, retained default autocapture and session recording behavior, enabled exception capture, identified authenticated users on login and returning sessions, reset identity on logout, and instrumented key SaaS conversion, engagement, and security actions. The production build completed successfully.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticated and entered the application. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | An authenticated user logged out of the application. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | A user created a project with a selected initial status. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | A user added a team member with a selected role. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | A user successfully saved profile changes. | `src/app/pages/profile/profile.component.ts` |
| `notification_preferences_saved` | A user saved their notification preference configuration. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `workspace_preferences_saved` | A user saved display and workspace preferences. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_authentication_changed` | A user enabled or disabled two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | A user revoked one or more other authenticated sessions. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Next steps

The PostHog dashboard and notebook could not be created because the PostHog MCP server was unavailable during setup. Reconnect the server and create an **Analytics basics (wizard)** dashboard using the event contract above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` with real persisted credentials in the deployed authentication implementation.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
