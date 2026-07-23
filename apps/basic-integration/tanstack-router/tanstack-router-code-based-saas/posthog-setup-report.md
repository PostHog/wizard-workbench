# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. The following changes were made:

- **Installed** `posthog-js` and `@posthog/react` via pnpm.
- **Added** `PostHogProvider` to the root route component (`RootComponent`) in `src/main.tsx`, wrapping the entire app so all child routes have access to the PostHog client.
- **Configured** a Vite reverse proxy in `vite.config.js` so PostHog requests route through `/ingest` (both `/ingest/static` and `/ingest/array` route to the assets CDN; all other `/ingest` traffic routes to the PostHog ingest host). This improves ad-blocker resilience.
- **Set up** environment variables `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in `.env`.
- **Added** `vite/client` types to `tsconfig.json` so `import.meta.env` is recognised by TypeScript.
- **Added** a dev-mode console error that fires when `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` is missing, so missing configuration is never silent during development.
- **Instrumented** 8 key business events (see table below) including user identification on login and session reset on logout.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form and signs into CloudFlow. | `src/main.tsx` |
| `user_signed_out` | User clicks the Sign Out button from the profile or login page. | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice from the invoices page. | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice. | `src/main.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button on the profile/account settings page. | `src/main.tsx` |
| `invoice_viewed` | User opens a specific invoice detail page, marking the top of the invoice funnel. | `src/main.tsx` |
| `team_member_viewed` | User opens a team member profile page to view their details. | `src/main.tsx` |
| `dashboard_viewed` | User lands on the dashboard overview page. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1897575)
- **Daily sign-ins**: [https://us.i.posthog.com/project/483112/insights/R0OBKUmy](https://us.i.posthog.com/project/483112/insights/R0OBKUmy)
- **Invoice creation funnel** (dashboard_viewed → invoice_viewed → invoice_created): [https://us.i.posthog.com/project/483112/insights/SUP9fu40](https://us.i.posthog.com/project/483112/insights/SUP9fu40)
- **Upgrade clicks over time**: [https://us.i.posthog.com/project/483112/insights/dNJLBimD](https://us.i.posthog.com/project/483112/insights/dNJLBimD)
- **Invoices created over time**: [https://us.i.posthog.com/project/483112/insights/oi3ODy53](https://us.i.posthog.com/project/483112/insights/oi3ODy53)
- **Sign-outs over time (churn signal)**: [https://us.i.posthog.com/project/483112/insights/DROIcFZg](https://us.i.posthog.com/project/483112/insights/DROIcFZg)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. (Note: this app uses in-memory auth that clears on page refresh, so returning visitors are always treated as fresh logins — if you add session persistence, ensure `identify` is called when restoring the session.)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
