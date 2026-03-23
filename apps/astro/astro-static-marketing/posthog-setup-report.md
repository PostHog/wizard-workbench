<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. The following changes were made:

- Created `src/components/posthog.astro` — a reusable PostHog initialization component using the web snippet with `is:inline` to prevent Astro from processing it. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables.
- Updated `src/layouts/Layout.astro` — imported and mounted `<PostHog />` inside `<head>` so all pages automatically initialize PostHog.
- Added click event tracking inline scripts to `src/pages/index.astro`, `src/pages/pricing.astro`, `src/pages/docs.astro`, and `src/components/Navigation.astro`.
- Created `.env` with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the "Start Free Trial" CTA in the homepage hero | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the "Read the Docs" CTA in the homepage hero | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card | `src/pages/docs.astro` |

## Next steps

We recommend creating an "Analytics basics" dashboard in PostHog with the following insights to monitor user behavior on the NeuralFlow marketing site:

1. **CTA conversion funnel** — Funnel from `$pageview` (homepage) → `cta_clicked` → (sign-up completion). Tracks how many visitors convert via the primary hero CTA.
2. **Pricing plan interest** — Trend of `pricing_plan_clicked` broken down by `plan` property (starter / pro / enterprise). Shows which plan tier attracts most interest.
3. **Nav vs hero CTA comparison** — Bar chart comparing `nav_cta_clicked` vs `cta_clicked` event counts. Reveals which CTA placement is most effective.
4. **Docs section popularity** — Trend or bar of `docs_section_clicked` broken down by `section` property. Highlights which documentation topics users seek most.
5. **Docs discovery path** — Funnel of `docs_cta_clicked` → `docs_section_clicked`. Measures engagement from the homepage docs link through to specific doc sections.

You can create this dashboard at: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
