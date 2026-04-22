<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. A reusable `posthog.astro` component was created and injected into the shared `Layout.astro` so that PostHog initializes on every page. Environment variables are used for the project token and host — no keys are hardcoded. Client-side event tracking was added to the hero CTAs, nav CTA, pricing plan buttons, and documentation section cards.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicked "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `read_docs_clicked` | User clicked "Read the Docs" in the hero section | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `pricing_plan_cta_clicked` | User clicked a pricing plan CTA button (with `plan` property: `starter`, `pro`, or `enterprise`) | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a documentation section card (with `section` property: `getting-started`, `api-reference`, `integrations`, `workflows`, `security`, `faq`) | `src/pages/docs.astro` |

## Files modified

- **`src/components/posthog.astro`** _(new)_ — PostHog web snippet component using `is:inline` and `define:vars` to safely inject env vars
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` inside `<head>` so all pages are covered
- **`src/pages/index.astro`** — Tracks hero "Start Free Trial" and "Read the Docs" button clicks
- **`src/components/Navigation.astro`** — Tracks "Get Started" nav CTA clicks
- **`src/pages/pricing.astro`** — Tracks all three pricing plan CTA clicks with plan name as a property
- **`src/pages/docs.astro`** — Tracks documentation section card clicks with section name as a property
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set (covered by `.gitignore`)

## Next steps

We've instrumented key conversion and engagement events. To build insights and a dashboard, visit your PostHog project and create an **"Analytics basics"** dashboard with these recommended insights:

1. **Pricing funnel** — Funnel from `$pageview` (pricing page) → `pricing_plan_cta_clicked` — shows how many visitors click a plan CTA
2. **CTA breakdown by plan** — Trend of `pricing_plan_cta_clicked` broken down by the `plan` property — shows which plan gets the most interest
3. **Hero CTA trend** — Trend of `start_free_trial_clicked` over time — measures top-of-funnel conversion intent
4. **Docs engagement** — Trend of `docs_section_clicked` broken down by `section` property — shows which documentation topics interest users most
5. **Nav vs hero CTAs** — Bar chart comparing `nav_get_started_clicked` vs `start_free_trial_clicked` — reveals which CTA placement drives more clicks

Visit your PostHog project: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
