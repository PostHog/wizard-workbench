# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this static Astro marketing site (NeuralFlow AI). A new `src/components/posthog.astro` initialization component was created using the PostHog web snippet with `is:inline` and `define:vars` to safely pass environment variables. The component is imported and rendered in `<head>` inside `src/layouts/Layout.astro`, so every page automatically loads PostHog. Click event tracking was added across the most business-critical surfaces: the hero CTA buttons on the homepage, all pricing plan and "Contact Sales" CTAs on the pricing page, docs section cards on the docs page, and the "Get Started" button in the navigation bar. Environment variables (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`) are stored in `.env` and referenced via `import.meta.env` — no secrets are hardcoded.

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary "Start Free Trial" button in the hero section. | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks the "Read the Docs" secondary CTA button in the hero section. | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA button (Starter or Pro) on the pricing page. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" button on the Enterprise pricing card. | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card on the docs page. | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" button in the top navigation bar. | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1761052)
- Insight: [Start Free Trial Clicks](https://us.posthog.com/project/483112/insights/ldLjVLEc)
- Insight: [Pricing Plan Selections by Plan](https://us.posthog.com/project/483112/insights/bDzmfdlk)
- Insight: [Pricing Page Conversion Funnel](https://us.posthog.com/project/483112/insights/7EACNlNH)
- Insight: [Contact Sales Clicks (Enterprise)](https://us.posthog.com/project/483112/insights/VwgAMIyI)
- Insight: [Docs Section Engagement](https://us.posthog.com/project/483112/insights/kIrvRKvB)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
