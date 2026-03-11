<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow AI Astro (View Transitions) marketing site. Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new): PostHog analytics snippet using the web snippet with `is:inline` to prevent Astro TypeScript processing. Includes the required `window.__posthog_initialized` guard to prevent stack overflow errors during ClientRouter soft navigation, and sets `capture_pageview: 'history_change'` for automatic pageview tracking on all soft navigations.
- **`src/layouts/Layout.astro`** (edited): Imports and renders `<PostHog />` in the `<head>` so analytics loads on every page.
- **`src/pages/index.astro`** (edited): Tracks hero CTA clicks (`cta_clicked`) and docs link clicks (`docs_cta_clicked`). Uses `astro:page-load` event to re-attach listeners after view transitions.
- **`src/pages/pricing.astro`** (edited): Tracks plan selection buttons (`pricing_plan_selected` with `plan` property for Starter/Pro) and the Enterprise contact button (`contact_sales_clicked`). Uses `astro:page-load` for view transition compatibility.
- **`src/pages/docs.astro`** (edited): Tracks documentation section card clicks (`docs_section_clicked` with `section` property). Uses `astro:page-load` for view transition compatibility.
- **`src/components/Navigation.astro`** (edited): Tracks nav bar Get Started CTA clicks (`nav_cta_clicked`). Uses `astro:page-load` for view transition compatibility.
- **`.env`** (created/updated): `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables set and covered by `.gitignore`.
- **`posthog-js`** package installed as a dependency.

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked "Start Free Trial" on the homepage hero | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked "Read the Docs" on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked Get Started / Start Free Trial on the pricing page (`plan` property: Starter or Pro) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" for the Enterprise plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card (`section` property: Getting Started, API Reference, etc.) | `src/pages/docs.astro` |

## Next steps

We recommend building an "Analytics basics" dashboard in PostHog with the following insights to monitor your marketing funnel:

1. **Homepage CTA conversion trend** — Trend of `cta_clicked` over time to see how many users click to start a free trial.
2. **Pricing plan funnel** — Funnel from `$pageview` (pricing page) → `pricing_plan_selected` to measure pricing page conversion rate.
3. **Plan preference breakdown** — Breakdown of `pricing_plan_selected` by `plan` property (Starter vs Pro) to see which plans are most popular.
4. **Enterprise interest trend** — Trend of `contact_sales_clicked` to track enterprise pipeline intent.
5. **Docs engagement by section** — Breakdown of `docs_section_clicked` by `section` property to understand what documentation users care about most.

You can create these in PostHog at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
