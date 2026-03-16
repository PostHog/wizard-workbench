<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro site. The following changes were made:

- **Created** `src/components/posthog.astro` — a reusable PostHog initialization component using the web snippet with `is:inline` to prevent Astro from processing it. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **Updated** `src/layouts/Layout.astro` — imports and renders `<PostHog />` inside `<head>`, so every page automatically initializes PostHog.
- **Updated** `src/pages/index.astro` — tracks `hero_cta_clicked` (Start Free Trial) and `hero_docs_cta_clicked` (Read the Docs) on the hero CTA buttons.
- **Updated** `src/components/Navigation.astro` — tracks `nav_get_started_clicked` when the top-nav Get Started button is clicked.
- **Updated** `src/pages/pricing.astro` — tracks `pricing_plan_clicked` with `plan` (starter / pro / enterprise) and `cta` properties on each pricing card button.
- **Updated** `src/pages/docs.astro` — tracks `docs_section_clicked` with a `section` property on each documentation card click.
- **Created** `.env` — stores `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

| Event | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks the primary 'Start Free Trial' CTA button in the hero section | `src/pages/index.astro` |
| `hero_docs_cta_clicked` | User clicks the 'Read the Docs' secondary CTA button in the hero section | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' CTA button in the top navigation bar | `src/components/Navigation.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (Get Started / Start Free Trial / Contact Sales) | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card (Getting Started, API Reference, etc.) | `src/pages/docs.astro` |

## Next steps

Log in to your PostHog project and build insights around these events. Recommended insights:

- **CTA conversion funnel**: `hero_cta_clicked` → `pricing_plan_clicked` (plan = pro or starter) to see how many homepage visitors reach a pricing decision.
- **Pricing plan breakdown**: `pricing_plan_clicked` filtered by `plan` property to compare interest across Starter, Pro, and Enterprise tiers.
- **Nav vs hero CTA comparison**: Trend of `nav_get_started_clicked` vs `hero_cta_clicked` to see which entry point drives more engagement.
- **Docs engagement**: `docs_section_clicked` broken down by `section` to see which documentation topics attract the most interest.
- **Hero secondary CTA**: Trend of `hero_docs_cta_clicked` to measure how many visitors explore documentation before converting.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
