<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. Here's a summary of all changes made:

- **`src/components/posthog.astro`** *(new)* — PostHog web snippet component using `is:inline` and `define:vars` to inject environment variables at build time. Prevents TypeScript errors and keeps tokens out of source code.
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` in `<head>` so analytics loads on every page.
- **`src/pages/index.astro`** — Tracks hero CTA clicks.
- **`src/pages/pricing.astro`** — Tracks pricing plan selections and Contact Sales clicks.
- **`src/pages/docs.astro`** — Tracks documentation section clicks.
- **`src/components/Navigation.astro`** — Tracks "Get Started" nav CTA clicks.
- **`src/components/Footer.astro`** — Tracks footer link clicks.
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set and `.gitignore`-covered.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Starter or Pro) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `doc_section_clicked` | User clicked a docs section card (Getting Started, API Reference, etc.) | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked "Get Started" in the top navigation | `src/components/Navigation.astro` |
| `footer_link_clicked` | User clicked a footer link (Features, Pricing, About, Docs, Privacy, Terms) | `src/components/Footer.astro` |

## Next steps

To visualize your data, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Trial conversion funnel** — Funnel from `cta_clicked` → `pricing_plan_clicked` → `contact_sales_clicked` to see how visitors move from hero interest to pricing commitment.
2. **CTA click trend** — Trend of `cta_clicked` over time to track top-of-funnel volume.
3. **Pricing plan breakdown** — Trend of `pricing_plan_clicked` broken down by `plan` property to see which plans attract the most interest (Starter vs Pro).
4. **Docs section engagement** — Trend of `doc_section_clicked` broken down by `section` property to identify the most-visited documentation areas.
5. **Navigation engagement** — Trend combining `nav_cta_clicked` and `footer_link_clicked` to measure overall site engagement signals.

Visit your PostHog project to create the dashboard: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
