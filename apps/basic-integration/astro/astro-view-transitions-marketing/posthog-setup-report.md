# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The integration adds:

- A reusable `src/components/posthog.astro` component that initializes PostHog with the View Transitions guard (`window.__posthog_initialized`) and automatic pageview tracking (`capture_pageview: 'history_change'`) for soft navigation.
- The Layout (`src/layouts/Layout.astro`) now imports and renders the PostHog component in the `<head>` so every page is covered automatically.
- Inline `<script is:inline>` blocks on pages and the Navigation component capture business-critical CTA clicks. Each script registers handlers on both `DOMContentLoaded` and `astro:page-load` to correctly re-attach listeners after View Transitions navigate to new pages.
- Environment variables (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`) are stored in `.env` and injected via `define:vars` — no keys are hardcoded.

| Event | Description | File |
|---|---|---|
| `free_trial_started` | User clicked "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `docs_link_clicked` | User clicked "Read the Docs" in the hero section | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `pricing_plan_selected` | User clicked a plan CTA (starter or pro); includes `plan` and `action` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise plan; includes `plan: "enterprise"` | `src/pages/pricing.astro` |
| `doc_section_clicked` | User clicked a documentation section card; includes `section` property | `src/pages/docs.astro` |

## Next steps

The PostHog MCP API key used during this run does not have the `dashboard:write` or `query:read` scopes, so the dashboard could not be created automatically. You can build it manually:

- [Go to Dashboards](https://us.posthog.com/project/2/dashboard) — create a new dashboard named **"Analytics basics (wizard)"**
- [Create a new Insight](https://us.posthog.com/project/2/insights/new) — suggested insights:
  1. **Free trial conversion funnel** — Funnel: `free_trial_started` → any downstream signup event
  2. **Pricing CTA breakdown** — Trends: `pricing_plan_selected` broken down by `plan` property
  3. **Contact sales volume** — Trends: `contact_sales_clicked` over time
  4. **Hero vs Nav CTAs** — Trends: `free_trial_started` + `nav_get_started_clicked` side by side
  5. **Docs engagement** — Trends: `doc_section_clicked` broken down by `section` property

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
