# PostHog post-wizard report

The wizard has completed a full PostHog integration for this static Astro marketing site. A `src/components/posthog.astro` initialization component was created using the PostHog web snippet with `is:inline` to prevent Astro from processing it, and the component was imported into `src/layouts/Layout.astro` so it loads on every page. Inline `<script is:inline>` blocks were added to four files to capture six key business events covering the main conversion and engagement actions on the site. Environment variables for the PostHog token and host are stored in `.env`.

| Event name | Description | File |
|---|---|---|
| `free_trial_started` | User clicks the "Start Free Trial" CTA button in the hero section. | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks the "Read the Docs" button in the hero section. | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a CTA button on a pricing plan card (Starter or Pro), with a `plan` property. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" button on the Enterprise pricing plan. | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card on the docs page, with a `section` property. | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicks the "Get Started" CTA in the navigation bar. | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812921)
- [Free Trial CTA Clicks](https://us.posthog.com/project/483112/insights/zvNQH8cd)
- [Pricing CTA Clicks by Plan](https://us.posthog.com/project/483112/insights/avqOZ1KQ)
- [Conversion Funnel: Pricing to Free Trial](https://us.posthog.com/project/483112/insights/Um3ZQmEO)
- [Contact Sales Clicks](https://us.posthog.com/project/483112/insights/iOFeKLfN)
- [Docs Section Engagement](https://us.posthog.com/project/483112/insights/5TbFrRYR)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
