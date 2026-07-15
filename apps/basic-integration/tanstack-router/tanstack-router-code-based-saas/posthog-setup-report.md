# PostHog post-wizard report

PostHog has been integrated into the React TanStack Router application. The browser SDK is configured at the root route using Vite environment variables, with exception capture enabled. The integration identifies users after the demo sign-in flow, resets identity after sign-out, and captures the key invoice and subscription actions without sending form content or other user-entered data as event properties.

The `posthog-js` and `@posthog/react` dependencies were installed, and Vite environment type support was added. The production build completed successfully after the integration.

| Event name | Description | File |
| --- | --- | --- |
| `invoice_created` | Captured when a user successfully creates an invoice. | `src/main.tsx` |
| `invoice_updated` | Captured when a user successfully saves changes to an invoice. | `src/main.tsx` |
| `user_signed_in` | Captured when a user completes the demo sign-in flow. | `src/main.tsx` |
| `user_signed_out` | Captured when a signed-in user signs out. | `src/main.tsx` |
| `subscription_upgrade_clicked` | Captured when a user clicks the subscription upgrade action. | `src/main.tsx` |

## Next steps

A dashboard and notebook could not be created because the configured PostHog MCP server was unavailable in this environment. Create an **Analytics basics (wizard)** dashboard in PostHog with trends for the events above once MCP connectivity is restored.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

The PostHog integration skill is available in the project’s agent skill folder for future development work.
