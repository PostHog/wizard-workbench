<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A singleton `PostHogService` was created and injected into the root `AppComponent` for initialization. PostHog is initialized with SSR safety guards using `isPlatformBrowser`. User identification (`posthog.identify`) is called on login with the user's ID, username, email, and name. Session identity is reset (`posthog.reset`) on logout. Eleven events were instrumented across authentication, project management, team, billing, profile, account settings, and security flows. Environment variables for the PostHog token and host are loaded via `import.meta.env` (Angular's Vite-based build system) and a `src/env.d.ts` type declaration file was added to support this pattern.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logs in | `src/app/auth/services/authentication.service.ts` |
| `user_signed_out` | User logs out of the application | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | User adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_page_viewed` | User views the billing page (funnel top) | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | User saves profile changes | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_authentication_toggled` | User enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes a specific active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `all_sessions_revoked` | User revokes all other active sessions | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | User clicks a quick action on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

The PostHog MCP API key used during setup did not have the `dashboard:write`, `insight:write`, or `query:read` scopes required to create a dashboard automatically. To create the "Analytics basics (wizard)" dashboard, log in to PostHog and build insights for:

1. **Sign-in trend** — Trends chart on `user_signed_in` over time
2. **Project creation funnel** — Funnel from `user_signed_in` → `project_created`
3. **Billing conversion funnel** — Funnel from `billing_page_viewed` → (plan upgrade action, if instrumented)
4. **Team growth** — Trends chart on `member_added` over time
5. **Security activity** — Trends chart combining `two_factor_authentication_toggled` + `session_revoked` + `all_sessions_revoked`

Group them into a dashboard named **Analytics basics (wizard)** in your PostHog project at [us.posthog.com/project/2](https://us.posthog.com/project/2).

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
