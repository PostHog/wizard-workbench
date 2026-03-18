<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI static Astro marketing site.

## Changes made

- **`src/components/posthog.astro`** *(new)* — PostHog snippet component using the `is:inline` directive. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` in the `<head>`, so PostHog initializes on every page.
- **`src/pages/index.astro`** — Tracks hero CTA clicks (`cta_clicked`, `docs_cta_clicked`).
- **`src/pages/pricing.astro`** — Tracks pricing plan selections (`pricing_plan_selected`) and Enterprise contact clicks (`contact_sales_clicked`).
- **`src/components/Navigation.astro`** — Tracks nav "Get Started" CTA clicks (`nav_cta_clicked`).
- **`src/pages/docs.astro`** — Tracks documentation section card clicks (`docs_section_clicked`).
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set (gitignored).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary 'Start Free Trial' CTA button in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the 'Read the Docs' secondary CTA button in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a CTA button on a pricing plan card (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked the 'Contact Sales' button on the Enterprise pricing card | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked the 'Get Started' call-to-action link in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card (Getting Started, API Reference, etc.) | `src/pages/docs.astro` |

## Next steps

To view your analytics, log in to PostHog and create an **"Analytics basics"** dashboard with these suggested insights:

1. **Trial conversion funnel** — Funnel from pageview → `cta_clicked` or `pricing_plan_selected` → `contact_sales_clicked`
2. **CTA clicks over time** — Trend of `cta_clicked` + `nav_cta_clicked` to track top-of-funnel intent
3. **Pricing plan interest breakdown** — Bar chart of `pricing_plan_selected` grouped by `plan` property
4. **Docs engagement** — Trend of `docs_section_clicked` grouped by `section` property
5. **Enterprise pipeline** — Trend of `contact_sales_clicked` to track high-value lead generation

Visit [PostHog](https://us.posthog.com/project/2) to build these insights and monitor your marketing site performance.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
