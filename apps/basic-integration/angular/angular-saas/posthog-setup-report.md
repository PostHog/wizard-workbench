<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. Here is a summary of the changes made:

- **PostHog service** (`src/app/@core/services/posthog.service.ts`): Created a singleton root service that wraps the PostHog SDK with SSR safety via `isPlatformBrowser` checks and a no-op proxy for server-side rendering.
- **App initialization** (`src/app/app.component.ts`): PostHog is initialized in `ngOnInit` of the root component using environment-configured keys, with a reverse proxy host (`/ingest`) and exception capture enabled.
- **Environment configuration** (`src/environments/environment.ts`, `src/environments/environment.prod.ts`, `src/environments/.env.ts`): Added `posthogKey` and `posthogHost` fields, reading from the `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` environment variables.
- **Reverse proxy** (`proxy.conf.json`, `angular.json`): Configured Angular dev server proxy to route `/ingest/*` to PostHog ingestion and `/ingest/static/*` and `/ingest/array/*` to the PostHog assets CDN.
- **User identification** (`src/app/auth/services/authentication.service.ts`): `posthog.identify()` is called on login using the user's ID and username. `user_logged_in` is captured on successful authentication.
- **Logout tracking** (`src/app/auth/logout/logout.component.ts`): `user_logged_out` is captured and `posthog.reset()` is called to clear the session on logout.
- **Event tracking** across key components: project creation, team member onboarding, profile updates, billing page views, 2FA toggles, and session revocations.
- **Error tracking** (`src/app/@core/interceptors/error-handler.interceptor.ts`): HTTP errors are captured via `posthog.captureException()` and a `http_error_occurred` event with status and URL.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in to the application. | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | User logs out of the application. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project from the dashboard modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User adds a new member to the team. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | User saves changes to their profile information. | `src/app/pages/profile/profile.component.ts` |
| `billing_plan_viewed` | User views the billing page with available subscription plans. | `src/app/pages/billing/billing.component.ts` |
| `two_factor_auth_toggled` | User enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active device session from security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `http_error_occurred` | An HTTP request error is caught by the global error handler interceptor. | `src/app/@core/interceptors/error-handler.interceptor.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1792369)
- **User Login Trend**: [https://us.posthog.com/project/483112/insights/ca13cywn](https://us.posthog.com/project/483112/insights/ca13cywn)
- **Project Creation Funnel**: [https://us.posthog.com/project/483112/insights/E4in11MC](https://us.posthog.com/project/483112/insights/E4in11MC)
- **Team Growth**: [https://us.posthog.com/project/483112/insights/juUwYTaK](https://us.posthog.com/project/483112/insights/juUwYTaK)
- **Security Actions**: [https://us.posthog.com/project/483112/insights/dE2MO6kj](https://us.posthog.com/project/483112/insights/dE2MO6kj)
- **Profile Updates**: [https://us.posthog.com/project/483112/insights/JRhq6cEA](https://us.posthog.com/project/483112/insights/JRhq6cEA)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
