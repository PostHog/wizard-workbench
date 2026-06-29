<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloudFlow, a React + TanStack Router (code-based) SaaS application. Changes include: wrapping the root route component with `PostHogProvider` configured with a Vite reverse proxy (`/ingest`), adding user identification on login with `posthog.identify()`, capturing six business events across the invoice, auth, and team-management flows, and enabling automatic exception tracking via `capture_exceptions: true`. The Vite dev-server proxy was also configured so PostHog requests are routed through `/ingest` rather than hitting the PostHog origin directly.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user submits the login form and authenticates successfully. | `src/main.tsx` |
| `user_signed_out` | Fired when a user clicks the sign-out button from the profile or login page. | `src/main.tsx` |
| `invoice_created` | Fired when a user submits the create invoice form successfully. | `src/main.tsx` |
| `invoice_updated` | Fired when a user saves changes to an existing invoice. | `src/main.tsx` |
| `upgrade_clicked` | Fired when a user clicks the Upgrade button on the profile/account page. | `src/main.tsx` |
| `team_member_viewed` | Fired when a user navigates to and views a specific team member's profile. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1775190)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
