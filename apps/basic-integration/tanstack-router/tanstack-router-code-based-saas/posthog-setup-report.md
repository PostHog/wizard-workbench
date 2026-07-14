# PostHog post-wizard report

The wizard completed a PostHog integration for this TanStack Router React app by installing the client SDK, initializing `PostHogProvider` at the root route, wiring a Vite reverse proxy for ingestion, adding required Vite env typing, setting local environment variables, identifying authenticated users on login and refresh, resetting identity on logout, capturing key billing and account intent events, and forwarding captured exceptions for error tracking. The integration was verified with `pnpm build`.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures a successful sign-in to correlate authenticated product usage. | `src/main.tsx` |
| `user_logged_out` | Captures when an authenticated user signs out and resets their analytics identity. | `src/main.tsx` |
| `invoice_created` | Captures successful invoice creation from the dashboard workflow. | `src/main.tsx` |
| `invoice_updated` | Captures successful invoice edits from the invoice details workflow. | `src/main.tsx` |
| `invoice_creation_failed` | Captures invoice creation failures to surface broken revenue workflows. | `src/main.tsx` |
| `invoice_update_failed` | Captures invoice update failures to surface broken billing operations. | `src/main.tsx` |
| `team_member_viewed` | Captures when a team member profile is opened from the dashboard. | `src/main.tsx` |
| `subscription_upgrade_clicked` | Captures upgrade intent from the account subscription area. | `src/main.tsx` |
| `test_error_triggered` | Captures deliberate test error actions and forwards the exception to PostHog error tracking. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846894)
- [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/TwDcCGSo)
- [Invoice workflow funnel (wizard)](https://us.posthog.com/project/483112/insights/OtVm8O7k)
- [Invoice failures over time (wizard)](https://us.posthog.com/project/483112/insights/ApKGHrZs)
- [Team profile views by company (wizard)](https://us.posthog.com/project/483112/insights/ZPtWKlzO)
- [Upgrade clicks over time (wizard)](https://us.posthog.com/project/483112/insights/nX6zS8Xe)

A PostHog notebook copy could not be created because the current MCP credentials are missing the `notebook:write` scope.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap scripts so collaborators know what to set: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or bundler upload) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — this integration includes an auth sync helper, but it should be validated in the real authenticated app flow.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
