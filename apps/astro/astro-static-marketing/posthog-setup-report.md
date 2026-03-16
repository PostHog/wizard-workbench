<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. Here's a summary of all changes made:

- **`src/components/posthog.astro`** *(new file)* — PostHog initialization component using the web snippet with `is:inline` directive. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`src/layouts/Layout.astro`** — Imported and added `<PostHog />` to the `<head>` so PostHog loads on every page.
- **`src/pages/index.astro`** — Added click tracking on the "Start Free Trial" and "Read the Docs" hero buttons.
- **`src/pages/pricing.astro`** — Added click tracking on all pricing plan buttons (Starter, Pro) and the Enterprise "Contact Sales" button.
- **`src/components/Navigation.astro`** — Added click tracking on the "Get Started" nav CTA.
- **`src/pages/docs.astro`** — Added click tracking on all documentation section cards with the section name as a property.
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` values.

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `docs_link_clicked` | User clicks "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan button (Starter or Pro), with `plan` property | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise tier | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a documentation section card, with `section` property | `src/pages/docs.astro` |

## Next steps

To visualize this data, create an **"Analytics basics"** dashboard in PostHog at:

- [PostHog Project Dashboard — create new](https://us.posthog.com/project/2/dashboard)

Suggested insights to add:

1. **CTA conversion funnel** — Funnel: `cta_clicked` → (sign-up event when available)
2. **Pricing plan interest** — Breakdown of `pricing_plan_clicked` by `plan` property
3. **Contact Sales clicks** — Trend of `contact_sales_clicked` over time
4. **Docs engagement** — Breakdown of `docs_section_clicked` by `section` property
5. **Nav CTA clicks** — Trend of `nav_get_started_clicked` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
