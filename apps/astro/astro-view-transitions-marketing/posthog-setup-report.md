<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro with View Transitions).

## Summary of changes

- **`src/components/posthog.astro`** *(new)* — PostHog web snippet with `window.__posthog_initialized` guard to prevent stack overflow during soft navigation, and `capture_pageview: 'history_change'` for automatic pageview tracking across View Transitions.
- **`src/layouts/Layout.astro`** — Imported and added the `<PostHog />` component inside `<head>`, ensuring PostHog loads on all pages.
- **`src/components/Navigation.astro`** — Added `nav_cta_clicked` event when the "Get Started" nav CTA is clicked.
- **`src/pages/index.astro`** — Added `cta_clicked` events for the "Start Free Trial" and "Read the Docs" hero CTA buttons.
- **`src/pages/pricing.astro`** — Added `pricing_plan_clicked` events for all three pricing tier buttons (Starter, Pro, Enterprise).
- **`src/pages/docs.astro`** — Added `docs_section_clicked` event when users click any documentation section card.
- **`.env`** — Created with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `cta_clicked` | User clicked "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked CTA on the Starter plan ($29/month) | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicked CTA on the Pro plan ($99/month) | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicked CTA on the Enterprise plan (custom) | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card | `src/pages/docs.astro` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these insights:

1. **CTA Conversion Funnel** — Funnel from `cta_clicked` → `pricing_plan_clicked` to measure hero-to-pricing conversion
2. **Pricing Plan Interest** — Breakdown chart of `pricing_plan_clicked` by `plan` property (starter / pro / enterprise)
3. **CTA Clicks by Type** — Trend of `cta_clicked` events broken down by `cta_text` property
4. **Nav CTA Clicks** — Trend of `nav_cta_clicked` over time
5. **Docs Section Engagement** — Breakdown of `docs_section_clicked` by `section` property to see which docs are most interesting

Create these insights at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
