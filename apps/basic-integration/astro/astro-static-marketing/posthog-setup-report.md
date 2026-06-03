<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The following changes were made:

- **`src/components/posthog.astro`** (new) — PostHog initialization component using the web snippet with `is:inline` directive. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` in the `<head>` of every page, ensuring PostHog is initialized site-wide.
- **`src/pages/index.astro`** — Event tracking on the two hero CTA buttons.
- **`src/pages/pricing.astro`** — Pageview event on load plus click tracking on all three pricing plan CTAs.
- **`src/pages/features.astro`** — Pageview event on load to track feature page interest.
- **`src/pages/docs.astro`** — Pageview event on load plus click tracking on each documentation section card.
- **`src/components/Navigation.astro`** — Tracks the "Get Started" nav CTA and each navigation link click (with destination property).
- **`src/components/Footer.astro`** — Tracks all footer link clicks (with link name property).
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` variables.

| Event name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks "Start Free Trial" in the homepage hero | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicks "Read the Docs" in the homepage hero | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `nav_link_clicked` | User clicks a nav link; includes `destination` property | `src/components/Navigation.astro` |
| `pricing_viewed` | Pricing page loaded — entry into the revenue funnel | `src/pages/pricing.astro` |
| `pricing_cta_clicked` | User clicks a pricing plan CTA; includes `plan` property (`starter`, `pro`, `enterprise`) | `src/pages/pricing.astro` |
| `features_viewed` | Features page loaded — entry into the feature-awareness funnel | `src/pages/features.astro` |
| `docs_viewed` | Docs page loaded — entry into the onboarding/evaluation funnel | `src/pages/docs.astro` |
| `docs_section_clicked` | User clicks a docs section card; includes `section` property | `src/pages/docs.astro` |
| `footer_link_clicked` | User clicks a footer link; includes `link` property | `src/components/Footer.astro` |

## Next steps

The PostHog MCP API key used during this session did not have the `dashboard:write`, `insight:write`, or `query:read` scopes required to programmatically create dashboards and insights. To set up an **"Analytics basics"** dashboard, add the following Personal API Key scopes in [PostHog settings](/settings/user-api-keys) and re-run the wizard, or create the insights manually:

**Recommended insights for the "Analytics basics" dashboard:**

1. **Signup funnel** — Funnel: `pricing_viewed` → `pricing_cta_clicked` (filter `plan ≠ enterprise`) — shows conversion from pricing page view to trial start.
2. **Enterprise leads** — Trend: `pricing_cta_clicked` filtered by `plan = enterprise` — tracks contact sales intent over time.
3. **Hero CTA clicks over time** — Trend: `hero_cta_clicked` — tracks top-of-funnel interest from the homepage.
4. **Docs engagement** — Trend: `docs_section_clicked` broken down by `section` — shows which docs sections drive the most interest.
5. **Navigation patterns** — Trend: `nav_link_clicked` broken down by `destination` — shows which pages attract the most navigation intent.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
