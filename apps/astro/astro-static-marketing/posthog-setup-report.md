<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. A reusable `posthog.astro` component was created and injected into the shared `Layout.astro` so PostHog initializes on every page. Six conversion and engagement events were instrumented across the pages and navigation component, covering the full visitor journey from landing to pricing to documentation.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the main "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the "Read the Docs" secondary CTA in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a pricing plan CTA (Starter or Pro), with `plan` and `price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked the "Contact Sales" button on the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a documentation section card, with a `section` property | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicked the "Get Started" CTA in the main navigation bar | `src/components/Navigation.astro` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights to monitor user behavior and conversion:

1. **Trial conversion funnel** — Funnel: `$pageview` (on `/`) → `cta_clicked` → `pricing_plan_selected`
2. **Pricing plan breakdown** — Breakdown of `pricing_plan_selected` by `plan` property (Starter vs Pro)
3. **Enterprise lead intent** — Trend of `contact_sales_clicked` over time
4. **Top docs sections** — Breakdown of `docs_section_clicked` by `section` property
5. **Nav vs hero CTA comparison** — Trend comparing `nav_get_started_clicked` vs `cta_clicked`

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
