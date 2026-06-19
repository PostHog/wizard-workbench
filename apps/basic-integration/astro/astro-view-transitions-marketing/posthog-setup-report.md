<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro (View Transitions) marketing site. A new `src/components/posthog.astro` component was created to initialize PostHog via the web snippet, wrapped with a `window.__posthog_initialized` guard to prevent stack overflow errors during soft navigation with `<ViewTransitions />`. The component is imported and rendered inside `<head>` in `src/layouts/Layout.astro`, so it is present on every page. Event tracking was added across all key pages and shared components using `<script is:inline>` tags, each listening on both `DOMContentLoaded` and `astro:page-load` to handle View Transitions correctly and removing listeners before re-adding them to prevent duplicates. Environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are used throughout; values are stored in `.env`.

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks the 'Start Free Trial' CTA button in the hero section of the home page. | `src/pages/index.astro` |
| `read_docs_clicked` | User clicks the 'Read the Docs' button in the hero section of the home page. | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' CTA link in the main navigation bar. | `src/components/Navigation.astro` |
| `pricing_page_viewed` | User lands on the pricing page, marking the top of the conversion funnel. | `src/pages/pricing.astro` |
| `starter_plan_clicked` | User clicks 'Get Started' on the Starter ($29/month) pricing plan. | `src/pages/pricing.astro` |
| `pro_plan_trial_clicked` | User clicks 'Start Free Trial' on the Pro ($99/month) pricing plan. | `src/pages/pricing.astro` |
| `enterprise_contact_sales_clicked` | User clicks 'Contact Sales' on the Enterprise (custom) pricing plan. | `src/pages/pricing.astro` |
| `features_page_viewed` | User views the features page, indicating interest in product capabilities. | `src/pages/features.astro` |
| `docs_section_clicked` | User clicks a documentation section card on the docs hub page. | `src/pages/docs.astro` |
| `footer_link_clicked` | User clicks a link in the site footer, capturing navigation patterns. | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/477967/dashboard/1736863)
- [Pricing conversion funnel](https://us.i.posthog.com/project/477967/insights/lNt9LDJf)
- [Trial CTA clicks](https://us.i.posthog.com/project/477967/insights/01MreFMf)
- [Pricing plan selections](https://us.i.posthog.com/project/477967/insights/1l5h67ON)
- [Docs section engagement](https://us.i.posthog.com/project/477967/insights/TNeRa849)
- [Features page views](https://us.i.posthog.com/project/477967/insights/5sJZSEbR)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
