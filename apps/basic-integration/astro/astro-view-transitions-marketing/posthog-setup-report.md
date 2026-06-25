# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro (View Transitions) marketing site for NeuralFlow AI. A `src/components/posthog.astro` component was created with the PostHog web snippet, wrapped in a `window.__posthog_initialized` guard to prevent stack overflow during soft navigation, and with `capture_pageview: 'history_change'` for automatic pageview tracking. The component is imported and rendered in `src/layouts/Layout.astro` so it applies to every page. Environment variables (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`) are set in `.env` and passed to the snippet via Astro's `define:vars`. Eight custom events were instrumented across six files to cover the full marketing conversion funnel.

| Event name | Description | File |
|---|---|---|
| `free_trial_clicked` | User clicks the 'Start Free Trial' button in the hero section on the home page. | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks the 'Read the Docs' button in the hero section on the home page. | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA button (Starter or Pro) on the pricing page. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks 'Contact Sales' for the Enterprise plan on the pricing page. | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' CTA button in the navigation bar. | `src/components/Navigation.astro` |
| `doc_section_clicked` | User clicks on a documentation section card on the docs page. | `src/pages/docs.astro` |
| `features_page_viewed` | User lands on the features detail page, indicating top-of-funnel interest. | `src/pages/features.astro` |
| `footer_link_clicked` | User clicks a navigation link in the site footer. | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1761059)
- [Key Conversion Actions Over Time](https://us.i.posthog.com/project/483112/insights/1If4YENt)
- [Conversion Funnel: Features to Pricing to Trial](https://us.i.posthog.com/project/483112/insights/NOtOUcaX)
- [Pricing Plan Clicks by Plan Type](https://us.i.posthog.com/project/483112/insights/SwAWYvDq)
- [Overall Signup Intent](https://us.i.posthog.com/project/483112/insights/apx3jEe1)
- [Documentation Engagement](https://us.i.posthog.com/project/483112/insights/wKHpFTkm)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
