<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro with View Transitions / ClientRouter). The following changes were made:

- Created `src/components/posthog.astro`: A reusable PostHog initialization component using the web snippet. It includes an `is:inline` directive (to prevent Astro from processing it), passes API key and host via `define:vars` from environment variables, and wraps initialization in a `window.__posthog_initialized` guard to prevent stack overflow during View Transitions soft navigation. `capture_pageview: 'history_change'` ensures automatic pageview tracking on each soft navigation.
- Updated `src/layouts/Layout.astro`: Imported and rendered `<PostHog />` inside `<head>`, so every page using the layout is automatically instrumented.
- Added event capture to `src/pages/index.astro`: Tracks `cta_clicked` (hero "Start Free Trial") and `docs_cta_clicked` (hero "Read the Docs") clicks.
- Added event capture to `src/pages/pricing.astro`: Tracks `pricing_plan_selected` (Starter and Pro plan buttons, with `plan` and `action` properties) and `contact_sales_clicked` (Enterprise "Contact Sales").
- Added event capture to `src/components/Navigation.astro`: Tracks `nav_cta_clicked` on the top-nav "Get Started" button.
- Added event capture to `src/pages/docs.astro`: Tracks `docs_section_clicked` with a `section` property (e.g., "Getting Started", "API Reference") when a user clicks a docs card.

All scripts use the `is:inline` directive and listen on both `DOMContentLoaded` and `astro:page-load` to correctly re-attach event listeners after View Transitions soft navigations, following the official Astro + PostHog pattern.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks "Start Free Trial" on the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks "Read the Docs" on the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a plan CTA (Starter or Pro), includes `plan` and `action` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicks "Get Started" in the main navigation | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a documentation section card, includes `section` property | `src/pages/docs.astro` |

## Next steps

The PostHog MCP dashboard creation tools were not available in this environment. To set up your "Analytics basics" dashboard in PostHog, navigate to your project and create the following recommended insights:

1. **CTA conversion trend** - Trend of `cta_clicked` over time to monitor hero CTA engagement
2. **Pricing funnel** - Funnel from `$pageview` (pricing page) → `pricing_plan_selected` → `contact_sales_clicked` to measure conversion
3. **Top docs sections** - Breakdown of `docs_section_clicked` by `section` property to see which docs are most visited
4. **Nav vs hero CTA comparison** - Trend comparing `nav_cta_clicked` vs `cta_clicked` to see which placement converts better
5. **Pricing plan breakdown** - Breakdown of `pricing_plan_selected` by `plan` property (starter vs pro)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
