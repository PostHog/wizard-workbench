# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. Here's a summary of what was done:

- **Created** `src/components/posthog.astro` — A reusable PostHog initialization component using the web snippet with the `is:inline` directive (required to prevent Astro from processing the script and causing TypeScript errors). API key and host are loaded from environment variables via `define:vars`.
- **Updated** `src/layouts/Layout.astro` — Imported the `PostHog` component and added `<PostHog />` inside `<head>`, so every page on the site automatically initializes PostHog analytics.
- **Updated** `src/pages/index.astro` — Added click tracking on the hero "Start Free Trial" and "Read the Docs" CTA buttons.
- **Updated** `src/pages/pricing.astro` — Added a `pricing_viewed` event that fires when the pricing page loads (top of conversion funnel), plus individual click events for each pricing plan CTA.
- **Updated** `src/pages/docs.astro` — Added `docs_section_clicked` tracking on each documentation section card, with a `section` property to distinguish which section was clicked.
- **Updated** `src/components/Navigation.astro` — Added click tracking on the nav "Get Started" CTA and all navigation links (with a `destination` property).
- **Updated** `src/components/Footer.astro` — Added `footer_link_clicked` tracking on all footer links with a `destination` property.
- **Created** `.env` — Added `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables.

## Tracked Events

| Event Name | Description | File |
|---|---|---|
| `free_trial_clicked` | User clicked the 'Start Free Trial' button in the homepage hero section | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicked the 'Read the Docs' button in the homepage hero section | `src/pages/index.astro` |
| `pricing_viewed` | User viewed the pricing page — top of the conversion funnel | `src/pages/pricing.astro` |
| `starter_plan_selected` | User clicked 'Get Started' on the Starter plan ($29/month) | `src/pages/pricing.astro` |
| `pro_trial_started` | User clicked 'Start Free Trial' on the Pro plan ($99/month) | `src/pages/pricing.astro` |
| `enterprise_sales_contacted` | User clicked 'Contact Sales' on the Enterprise plan | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' CTA in the top navigation bar | `src/components/Navigation.astro` |
| `nav_link_clicked` | User clicked a navigation link (with `destination` property) | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card (with `section` property) | `src/pages/docs.astro` |
| `footer_link_clicked` | User clicked a footer link (with `destination` property) | `src/components/Footer.astro` |

## Next steps

We've set up the event tracking — head to your PostHog project to build the **"Analytics basics"** dashboard with these recommended insights:

1. **Conversion funnel** — Track the full conversion journey: `pricing_viewed` → (`starter_plan_selected` OR `pro_trial_started` OR `enterprise_sales_contacted`). This shows how many users who view pricing actually click a CTA.
2. **CTA performance** — A trend chart comparing `free_trial_clicked`, `nav_get_started_clicked`, and all pricing plan clicks over time. Understand which entry point drives the most conversions.
3. **Pricing plan breakdown** — A bar chart of `starter_plan_selected`, `pro_trial_started`, and `enterprise_sales_contacted` to see which plan is most popular.
4. **Documentation engagement** — A breakdown of `docs_section_clicked` by `section` property to identify which documentation topics attract the most interest.
5. **Navigation patterns** — A breakdown of `nav_link_clicked` by `destination` to understand how users explore the marketing site.

👉 [Open PostHog dashboard](https://us.i.posthog.com/project/238460/dashboard)
👉 [Create a new insight](https://us.i.posthog.com/project/238460/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
