# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. A `posthog.astro` component was created using the web snippet with an initialization guard (`window.__posthog_initialized`) to prevent stack overflow errors during Astro View Transitions soft navigation. The component is imported in `Layout.astro` so all pages receive analytics automatically. Seven custom events are instrumented across four files, covering the full conversion journey from landing to enterprise contact. Pageviews are tracked automatically via `capture_pageview: 'history_change'`. All scripts use `is:inline` to prevent Astro from processing them, and event listeners are removed then re-added on each `astro:page-load` to avoid duplicates during soft navigation.

| Event Name | Description | File |
|---|---|---|
| `free_trial_started` | User clicks the 'Start Free Trial' button in the homepage hero section. | `src/pages/index.astro` |
| `docs_link_clicked` | User clicks the 'Read the Docs' link in the homepage hero section. | `src/pages/index.astro` |
| `pricing_page_viewed` | User views the pricing page, marking entry into the bottom of the conversion funnel. | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicks a paid plan CTA (Starter or Pro) on the pricing page. | `src/pages/pricing.astro` |
| `enterprise_contact_requested` | User clicks 'Contact Sales' on the Enterprise pricing plan. | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' call-to-action in the navigation bar. | `src/components/Navigation.astro` |
| `doc_section_clicked` | User clicks a documentation section card on the docs page. | `src/pages/docs.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795659)
- [Pricing Page Conversion Funnel](https://us.posthog.com/project/483112/insights/9uSQC2kp)
- [CTA Clicks Over Time](https://us.posthog.com/project/483112/insights/W7gragTf)
- [Pricing Plan Selections by Plan](https://us.posthog.com/project/483112/insights/LLmZaT9G)
- [Docs Section Engagement](https://us.posthog.com/project/483112/insights/0EvRyPYH)
- [Enterprise Contact Requests](https://us.posthog.com/project/483112/insights/uiWqmH5I)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
