<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI marketing site (Astro hybrid rendering). The integration covers both client-side (browser) and server-side (API route) analytics, with session correlation between the two.

**What was added:**

- `src/components/posthog.astro` — Client-side PostHog snippet component using `is:inline` to prevent Astro from processing it. Initialized with environment variables.
- `src/lib/posthog-server.ts` — Singleton `posthog-node` client for server-side tracking in API routes. Uses `flushAt: 1` so events are sent immediately.
- `src/layouts/Layout.astro` — Updated to include the `<PostHog />` component in `<head>`, ensuring PostHog loads on every page.
- `src/components/Navigation.astro` — Tracks "Get Started" CTA clicks in the navbar.
- `src/pages/index.astro` — Tracks "Start Free Trial" and "Contact Sales" hero button clicks.
- `src/pages/pricing.astro` — Tracks plan CTA clicks (Starter, Pro, Enterprise) with plan name and action properties.
- `src/pages/contact.astro` — Passes PostHog session ID and distinct ID to the API on form submit. Identifies the user by email on successful submission.
- `src/pages/api/contact.ts` — Server-side `contact_form_submitted` and `contact_form_failed` events, with session correlation via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers.
- `.env` — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` added (gitignore coverage applied).

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `free_trial_clicked` | User clicked "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (with `plan` and `action` properties) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Contact form submitted successfully (server-side) | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form failed validation or server error (server-side) | `src/pages/api/contact.ts` |

## Next steps

Suggested insights to build in PostHog for this integration:

1. **CTA conversion funnel** — Funnel from `free_trial_clicked` → `contact_form_submitted`. Measures how many hero clicks turn into completed contact requests.
2. **Pricing plan interest** — Trends breakdown of `pricing_plan_clicked` by `plan` property. Shows which tier (Starter/Pro/Enterprise) attracts the most interest.
3. **Contact form success rate** — Ratio of `contact_form_submitted` vs `contact_form_failed`. Monitor form health.
4. **Navigation "Get Started" clicks** — Trend of `get_started_clicked` over time to gauge top-of-funnel intent.
5. **Contact sales funnel** — Funnel from `contact_sales_clicked` → `contact_form_submitted`. Measures direct sales intent conversion.

Create these in [PostHog Insights](/insights) and pin them to a new "Analytics basics" [dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
