# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. A `posthog.astro` component was created to load the PostHog snippet via `is:inline` and is injected into the shared `Layout.astro` so every page is covered automatically. Eight custom events were instrumented across five files, focusing on the key conversion funnel (pricing) and all primary CTA interactions. Environment variables are stored in `.env` and referenced via Astro's `PUBLIC_` prefix convention.

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicked the primary 'Start Free Trial' CTA on the hero section. | `src/pages/index.astro` |
| `read_docs_clicked` | User clicked the 'Read the Docs' secondary CTA on the hero section. | `src/pages/index.astro` |
| `pricing_viewed` | User viewed the pricing page, indicating top-of-funnel conversion intent. | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicked a CTA button on a pricing plan card (Starter or Pro), with `plan_name` property. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked 'Contact Sales' on the Enterprise pricing plan. | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' button in the top navigation bar. | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card, with `section_name` property. | `src/pages/docs.astro` |
| `features_viewed` | User viewed the features page, indicating product interest at the top of the conversion funnel. | `src/pages/features.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816741)
- [Pricing conversion funnel](https://us.posthog.com/project/483112/insights/EsEKHtui) — Funnel from `pricing_viewed` → `pricing_plan_selected`
- [CTA clicks over time](https://us.posthog.com/project/483112/insights/523cZhgX) — Daily trends for Start Free Trial, Nav Get Started, and Read Docs clicks
- [Pricing plan selections by plan](https://us.posthog.com/project/483112/insights/IzJbNidF) — Bar chart of `pricing_plan_selected` broken down by `plan_name`
- [Docs section engagement](https://us.posthog.com/project/483112/insights/XhmLbbky) — Bar chart of `docs_section_clicked` broken down by `section_name`
- [Top-of-funnel page engagement](https://us.posthog.com/project/483112/insights/0zHuR6Q5) — Trends comparing Features Viewed, Pricing Viewed, and Contact Sales

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
