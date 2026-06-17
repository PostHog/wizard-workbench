<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for CloudFlow, a React + TanStack Router (file-based routing) SaaS application. Changes span environment configuration, the Vite proxy, the root route layout, and four application routes.

## Summary of changes

| File | Change |
|------|--------|
| `vite.config.js` | Converted to a function-style `defineConfig`; added `/ingest`, `/ingest/static`, and `/ingest/array` reverse proxy entries so PostHog traffic routes through the dev server. |
| `tsconfig.json` | Added `"types": ["vite/client"]` so `import.meta.env` is correctly typed throughout the project. |
| `.env` | Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`. |
| `src/routes/__root.tsx` | Wrapped the entire app in `PostHogProvider` with `api_host: '/ingest'`, `capture_exceptions: true`, and `debug: import.meta.env.DEV`. |
| `src/routes/login.tsx` | Added `posthog.identify()` + `posthog.capture('user_logged_in')` on form submit; `posthog.capture('user_logged_out')` + `posthog.reset()` on sign-out. |
| `src/routes/dashboard.invoices.$invoiceId.tsx` | Added `posthog.capture('invoice_viewed')` on mount (top-of-funnel); `posthog.capture('invoice_updated')` in the save-changes form submit handler. |
| `src/routes/_auth.profile.tsx` | Added `posthog.capture('upgrade_plan_clicked')` on the Upgrade button click. |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully submits the login form and authenticates | `src/routes/login.tsx` |
| `user_logged_out` | Authenticated user clicks the Sign Out button | `src/routes/login.tsx` |
| `invoice_viewed` | User opens an invoice detail page — top of the invoice editing conversion funnel | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | User submits the invoice edit form to save changes | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account/profile page | `src/routes/_auth.profile.tsx` |

## Next steps

The PostHog API key used by the wizard did not have `insight:write` or `dashboard:write` scopes, so the dashboard could not be created automatically. Use these links to build the recommended insights yourself:

- **[Create a new insight](https://us.posthog.com/project/2/insights/new)** — suggested insights:
  - **Logins trend**: Trends → event `user_logged_in` — monitor daily active sign-ins
  - **Logouts / churn signal**: Trends → event `user_logged_out` — watch for logout spikes
  - **Invoice activity**: Trends → event `invoice_updated` — measure invoice editing activity
  - **Login → Invoice edit funnel**: Funnel → `user_logged_in` → `invoice_viewed` → `invoice_updated`
  - **Upgrade intent**: Trends → event `upgrade_plan_clicked` — track conversion interest
- **[View all dashboards](https://us.posthog.com/project/2/dashboard)** — create an "Analytics basics (wizard)" dashboard and pin the five insights above to it.

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login, which can leave returning sessions on anonymous distinct IDs. Consider calling `posthog.identify` during app init if a stored session username is available.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
