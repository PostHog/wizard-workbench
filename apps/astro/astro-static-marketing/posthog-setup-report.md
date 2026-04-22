<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. The following changes were made:

- Created `src/components/posthog.astro` — a reusable PostHog snippet component using `is:inline` (required for static Astro to prevent TypeScript errors) and `define:vars` to pass environment variables at build time.
- Updated `src/layouts/Layout.astro` — imported and included `<PostHog />` inside `<head>`, so analytics loads on every page automatically.
- Added event tracking to `src/pages/index.astro` — captures `start_free_trial_clicked` and `read_docs_clicked` when users click hero CTAs.
- Added event tracking to `src/pages/pricing.astro` — captures `pricing_plan_clicked` (with `plan` and `cta` properties) and `contact_sales_clicked` for every pricing plan button.
- Added event tracking to `src/pages/docs.astro` — captures `doc_section_clicked` (with `section` property) when users click any documentation section card.
- Added event tracking to `src/components/Navigation.astro` — captures `nav_cta_clicked` when users click the "Get Started" nav button.
- Created `.env` with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks the primary "Start Free Trial" CTA on the homepage hero | `src/pages/index.astro` |
| `read_docs_clicked` | User clicks the "Read the Docs" secondary CTA on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (includes `plan` and `cta` properties) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" CTA on the Enterprise plan | `src/pages/pricing.astro` |
| `doc_section_clicked` | User clicks a documentation section card (includes `section` property) | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We've built a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1119959)

To build insights tracking the above events, navigate to the dashboard and create insights such as:
- **Conversion funnel**: `start_free_trial_clicked` → `pricing_plan_clicked` (measures homepage-to-pricing CTA conversion)
- **Pricing plan breakdown**: `pricing_plan_clicked` grouped by `plan` property (shows which plan gets the most interest)
- **Contact sales trend**: `contact_sales_clicked` over time (enterprise lead generation)
- **Docs engagement**: `doc_section_clicked` grouped by `section` property (most popular doc sections)
- **Nav CTA trend**: `nav_cta_clicked` over time (global CTA engagement)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
