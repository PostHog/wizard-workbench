# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. A reusable `posthog.astro` component was created to initialize PostHog on every page via the existing `Layout.astro`. Event tracking was added to all key conversion and engagement touchpoints: the hero CTAs on the homepage, all three pricing plan CTAs, documentation section clicks, and the navigation "Get Started" button. Environment variables are used for all PostHog keys — no tokens are hardcoded.

| Event Name | Description | File |
|---|---|---|
| `free_trial_started` | User clicked the 'Start Free Trial' CTA button in the hero section of the homepage. | `src/pages/index.astro` |
| `docs_link_clicked` | User clicked the 'Read the Docs' button in the hero section of the homepage. | `src/pages/index.astro` |
| `pricing_viewed` | User visited the pricing page, indicating interest at the top of the conversion funnel. | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicked a CTA button on a paid pricing plan (Starter or Pro). | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked 'Contact Sales' on the Enterprise pricing plan. | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked on a documentation section card on the docs page. | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked the 'Get Started' call-to-action button in the navigation bar. | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Dashboard: Your starter dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Free Trial Conversions](https://us.posthog.com/project/483112/insights/zIgv8hSp)
- [Pricing Page Funnel](https://us.posthog.com/project/483112/insights/fEe427x6)
- [Plan Selection Breakdown](https://us.posthog.com/project/483112/insights/19BfU8qe)
- [Docs Engagement](https://us.posthog.com/project/483112/insights/35YUl924)
- [Navigation CTA vs Hero CTA](https://us.posthog.com/project/483112/insights/pA5cw4Of)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
