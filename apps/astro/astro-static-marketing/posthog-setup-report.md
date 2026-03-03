<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow Astro static marketing site. A reusable `posthog.astro` snippet component was created and added to the global `Layout.astro`, ensuring PostHog is initialized on every page. Six custom events were instrumented across the key conversion touchpoints: hero CTA clicks, pricing page entry, pricing plan selection, navigation CTA, and documentation section engagement. All PostHog credentials are stored in environment variables and never hardcoded.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks "Start Free Trial" in the hero section (`cta_label: "Start Free Trial"`) | `src/pages/index.astro` |
| `cta_clicked` | User clicks "Read the Docs" in the hero section (`cta_label: "Read the Docs"`) | `src/pages/index.astro` |
| `pricing_page_viewed` | User lands on the pricing page — top of the conversion funnel | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks a plan CTA (`plan: starter\|pro\|enterprise`) | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks "Get Started" in the top navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a documentation section card (`section: Getting Started\|API Reference\|…`) | `src/pages/docs.astro` |

## Next steps

To keep an eye on user behavior, create an **"Analytics basics"** dashboard in PostHog with the following recommended insights:

1. **Pricing conversion funnel** — Funnel: `pricing_page_viewed` → `pricing_plan_clicked`
2. **Hero CTA clicks over time** — Trend: `cta_clicked` broken down by `cta_label`
3. **Pricing plan breakdown** — Trend: `pricing_plan_clicked` broken down by `plan`
4. **Navigation & entry CTAs** — Trend: `nav_get_started_clicked` + `cta_clicked` combined
5. **Docs engagement** — Trend: `docs_section_clicked` broken down by `section`

To create the dashboard, visit [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) and click **New dashboard**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
