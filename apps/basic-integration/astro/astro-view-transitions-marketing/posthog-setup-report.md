<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro (View Transitions) marketing site. A new `src/components/posthog.astro` component was created with the PostHog web snippet, wrapped in a `window.__posthog_initialized` guard to prevent stack overflow errors during ClientRouter soft navigation. The component is included in `src/layouts/Layout.astro` (the shared layout used by all pages), so PostHog initializes once and tracks pageviews automatically via `capture_pageview: 'history_change'`. Custom event capture was added to four files using `is:inline` scripts that re-attach event listeners on both `DOMContentLoaded` and `astro:page-load` to handle both hard and soft navigation. Environment variables are loaded from `.env` using the Astro `PUBLIC_` convention.

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks the 'Start Free Trial' button on the homepage hero section. | `src/pages/index.astro` |
| `read_docs_clicked` | User clicks the 'Read the Docs' button on the homepage hero section. | `src/pages/index.astro` |
| `pricing_viewed` | User views the pricing page, the top of the conversion funnel. | `src/pages/pricing.astro` |
| `pricing_cta_clicked` | User clicks a call-to-action button on the pricing page (properties: `plan`, `cta`). | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks on a documentation section card (property: `section`). | `src/pages/docs.astro` |
| `get_started_clicked` | User clicks the 'Get Started' call-to-action in the navigation bar. | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792374)
- [Free Trial Clicks Over Time](https://us.posthog.com/project/483112/insights/g4nyDwxW)
- [Pricing Page Conversion Funnel](https://us.posthog.com/project/483112/insights/zZLhRwBa)
- [Pricing CTA Clicks by Plan](https://us.posthog.com/project/483112/insights/kwOm6Cf5)
- [Get Started Nav Clicks Over Time](https://us.posthog.com/project/483112/insights/W4J2pJT4)
- [Docs Section Clicks by Section](https://us.posthog.com/project/483112/insights/50kQXw9k)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
