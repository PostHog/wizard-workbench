# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow SaaS application. The following changes were made:

- **`src/vite-env.d.ts`** (new): Added Vite client type declarations so `import.meta.env` resolves correctly.
- **`vite.config.js`**: Updated to use `loadEnv` and added a Vite dev-server reverse proxy for PostHog ingestion (`/ingest`, `/ingest/static`, `/ingest/array`). All proxy targets reference environment variables — no hardcoded hosts.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSETS_HOST`. Covered by `.gitignore`.
- **`src/main.tsx`**: Added `PostHogProvider` wrapping the root route component; imported `usePostHog` and added event capture + user identification across key components.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in to their CloudFlow account. | `src/main.tsx` |
| `user_logged_out` | User signs out of their CloudFlow account. | `src/main.tsx` |
| `invoice_created` | User creates a new invoice with a title and description. | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice. | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account settings page. | `src/main.tsx` |
| `team_member_viewed` | User views a team member's profile in the team management section. | `src/main.tsx` |

## Next steps

The PostHog API key used during setup does not have `dashboard:write` or `insight:write` scopes, so the dashboard could not be created automatically. You can create it manually:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
- [Create New Insight](https://us.posthog.com/project/2/insights/new)

Suggested insights for the "Analytics basics (wizard)" dashboard:

1. **Sign-in trend** — Trends: `user_logged_in` over time.
2. **Invoice creation funnel** — Funnel: `user_logged_in` → `invoice_created`.
3. **Invoice update rate** — Trends: `invoice_updated` over time, broken down by `invoice_id`.
4. **Upgrade click rate** — Trends: `upgrade_plan_clicked` over time.
5. **Team member engagement** — Trends: `team_member_viewed` over time.

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSETS_HOST` to `.env.example` and any CI/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login, so returning sessions opened without re-logging-in will remain on anonymous distinct IDs until the user signs in again.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
