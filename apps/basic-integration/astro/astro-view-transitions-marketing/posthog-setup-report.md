<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow AI Astro (View Transitions) marketing site.

**What was done:**
- Installed `posthog-js` and set `PUBLIC_POSTHOG_PROJECT_TOKEN` / `PUBLIC_POSTHOG_HOST` in `.env`
- Created `src/components/posthog.astro` — the PostHog web snippet with a `window.__posthog_initialized` guard to prevent stack overflow errors during ClientRouter soft navigation, and `capture_pageview: 'history_change'` for automatic pageview tracking
- Updated `src/layouts/Layout.astro` to import and render `<PostHog />` inside `<head>`, so all pages are covered
- Added `astro:page-load` + `DOMContentLoaded` listeners throughout, following the View Transitions pattern — event listeners are re-attached after each soft navigation and de-duped with `removeEventListener` before re-adding

| Event | Description | File |
|-------|-------------|------|
| `hero_cta_clicked` | User clicked the primary "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicked the "Read the Docs" secondary CTA in the hero section | `src/pages/index.astro` |
| `pricing_viewed` | User viewed the pricing page — top of the conversion funnel | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicked a pricing CTA (Starter/Pro/Enterprise), with `plan` and `price` properties | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicked the "Get Started" button in the top navigation | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card, with `section` property | `src/pages/docs.astro` |
| `feature_card_clicked` | User clicked a feature card on the features page, with `feature` property | `src/pages/features.astro` |
| `footer_link_clicked` | User clicked a footer link, with `link_text` property | `src/components/Footer.astro` |

## Next steps

Build out the "Analytics basics" dashboard in PostHog with these recommended insights:

- **Pricing page conversion funnel** — [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS) using steps: `pricing_viewed` → `pricing_plan_clicked`
- **Hero CTA clicks over time** — [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS) tracking `hero_cta_clicked` and `hero_docs_clicked`
- **Pricing plan breakdown** — [Create breakdown insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS) tracking `pricing_plan_clicked` broken down by `plan`
- **Top docs sections** — [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS) tracking `docs_section_clicked` broken down by `section`
- **Navigation vs footer CTA clicks** — [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS) tracking `nav_get_started_clicked` and `footer_link_clicked`

You can group them all into a new dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
