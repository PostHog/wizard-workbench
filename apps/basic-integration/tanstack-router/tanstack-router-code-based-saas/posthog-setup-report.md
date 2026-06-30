<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. The following changes were made:

- **`vite.config.js`**: Converted to use `defineConfig` with `loadEnv` and added a reverse proxy for PostHog ingestion (`/ingest`, `/ingest/static`, `/ingest/array`) so all analytics traffic routes through the local dev server instead of hitting PostHog directly.
- **`src/vite-env.d.ts`** (new): Added Vite client type reference so `import.meta.env` is properly typed in TypeScript.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`src/main.tsx`**: Wrapped the root component with `PostHogProvider`, added `posthog.identify()` on login, and instrumented 7 events across 5 components (see table below). `posthog.reset()` is called on logout to clear the identity.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully submits the login form. | `src/main.tsx` |
| `user_logged_out` | Fired when a user clicks the sign-out button from the profile or login page. | `src/main.tsx` |
| `invoice_viewed` | Fired when a user opens a specific invoice detail page. | `src/main.tsx` |
| `invoice_created` | Fired when a user successfully creates a new invoice. | `src/main.tsx` |
| `invoice_updated` | Fired when a user successfully saves changes to an existing invoice. | `src/main.tsx` |
| `upgrade_plan_clicked` | Fired when a user clicks the Upgrade button on the account settings page. | `src/main.tsx` |
| `team_member_viewed` | Fired when a user opens a team member's profile page. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1777482)
- [User Login Trend](https://us.posthog.com/project/483112/insights/0nq3I7Lr)
- [Invoice Creation Funnel](https://us.posthog.com/project/483112/insights/bXAUJUJt)
- [Invoice Actions Breakdown](https://us.posthog.com/project/483112/insights/P3cmRI0g)
- [Plan Upgrade Interest](https://us.posthog.com/project/483112/insights/Ps0rpjXf)
- [User Retention](https://us.posthog.com/project/483112/insights/m6l6HiQb)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
