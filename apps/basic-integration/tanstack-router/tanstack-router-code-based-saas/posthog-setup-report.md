# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. The integration includes:

- **PostHogProvider** added to the root `RootComponent`, wrapping the entire React tree so all child routes have access to the PostHog client.
- **Reverse proxy** configured in `vite.config.js` so PostHog requests are routed through `/ingest`, avoiding ad-blockers and enabling first-party data collection.
- **Environment variables** set in `.env` for the PostHog project token and host (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`).
- **User identification** via `posthog.identify()` on login and `posthog.reset()` on logout, keeping analytics correlated with known users.
- **12 business events** instrumented across the authentication, invoice, and team management flows.
- **Error tracking** enabled via `capture_exceptions: true` in the PostHog init options.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User submits the login form and signs in | `src/main.tsx` |
| `user_signed_out` | User clicks the Sign Out button | `src/main.tsx` |
| `invoice_viewed` | User opens an invoice detail page (top of invoice conversion funnel) | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/main.tsx` |
| `invoice_create_failed` | Invoice creation fails with an error | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/main.tsx` |
| `invoice_update_failed` | Invoice update fails with an error | `src/main.tsx` |
| `invoice_notes_toggled` | User shows or hides internal notes on an invoice | `src/main.tsx` |
| `team_member_viewed` | User selects a team member to view their profile | `src/main.tsx` |
| `team_members_sorted` | User changes the sort order of the team members list | `src/main.tsx` |
| `team_members_searched` | User applies a search filter to the team members list | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the subscription section | `src/main.tsx` |

## Next steps

The PostHog API key provided did not have `dashboard:write` or `insight:write` scopes, so the dashboard could not be created automatically. To create the recommended "Analytics basics (wizard)" dashboard in PostHog, navigate to your [PostHog project](https://us.posthog.com/project/2/dashboards) and add the following insights:

1. **Sign-in trend** — Trends chart for `user_signed_in` over time. Shows active user growth.
2. **Invoice creation funnel** — Funnel: `invoice_viewed` → `invoice_created`. Shows conversion from invoice view to creation.
3. **Upgrade clicks** — Trends chart for `upgrade_plan_clicked`. Tracks monetization intent.
4. **Invoice error rate** — Trends chart comparing `invoice_created` vs `invoice_create_failed`. Highlights reliability issues.
5. **Team feature engagement** — Trends chart with `team_member_viewed`, `team_members_searched`, and `team_members_sorted` as separate series.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login. Consider calling `identify` on app load if a persisted session exists (e.g., if `auth.username` is already set).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
