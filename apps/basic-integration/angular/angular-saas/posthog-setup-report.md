# PostHog post-wizard report

The wizard integrated `posthog-js` into this Angular application through a singleton `PosthogService`, initialized from the root component outside Angular's zone. PostHog credentials are configured through `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` in `.env` and consumed by the environment configuration. Default PostHog collection remains enabled, including autocapture, session recording, automatic pageviews, and exception capture.

Authenticated users are identified after login and on returning sessions, with email, name, and role maintained as person properties. Logout captures the lifecycle event and resets the PostHog identity. Product actions and HTTP request exceptions are instrumented without placing user-entered PII in event properties.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures a successful authenticated session start. | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | Captures when an authenticated user ends their session. | `src/app/auth/services/authentication.service.ts` |
| `project_created` | Captures successful creation of a project by its selected status. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Captures successful addition of a team member by assigned role. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `account_settings_saved` | Captures a successful account-settings save without profile values. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Captures saving notification preference settings. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | Captures saving workspace display preferences. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_authentication_toggled` | Captures enabling or disabling two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Next steps

The local build completed successfully with `npm run build`.

The PostHog MCP service was unavailable during this run, so no dashboard, insights, or shareable notebook could be created. Once the service is available, create **Analytics basics (wizard)** in PostHog using the instrumented events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
