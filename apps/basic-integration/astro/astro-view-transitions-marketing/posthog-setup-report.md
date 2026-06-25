<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro marketing site. A new `src/components/posthog.astro` component was created containing the PostHog JavaScript snippet, wrapped with a `window.__posthog_initialized` guard to prevent stack overflow errors during Astro's View Transitions (soft navigation). The component uses `define:vars` to inject environment variables at build time and sets `capture_pageview: 'history_change'` for automatic pageview tracking across soft navigations. The component is imported in `src/layouts/Layout.astro` and placed in the `<head>`, ensuring PostHog initializes on every page. Event tracking was added across six files covering all key conversion and engagement points.

| Event Name | Description | File |
|---|---|---|
| `hero_trial_started` | User clicked 'Start Free Trial' in the homepage hero section | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicked 'Read the Docs' in the homepage hero section | `src/pages/index.astro` |
| `pricing_page_viewed` | User viewed the pricing page, indicating purchase intent | `src/pages/pricing.astro` |
| `starter_plan_selected` | User clicked 'Get Started' on the Starter plan ($29/mo) | `src/pages/pricing.astro` |
| `pro_trial_started` | User clicked 'Start Free Trial' on the Pro plan ($99/mo) | `src/pages/pricing.astro` |
| `enterprise_contact_requested` | User clicked 'Contact Sales' on the Enterprise plan | `src/pages/pricing.astro` |
| `features_page_viewed` | User viewed the features page, indicating product evaluation | `src/pages/features.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' CTA in the navigation bar | `src/components/Navigation.astro` |
| `nav_link_clicked` | User clicked a navigation link (with `destination` property) | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card (with `section` property) | `src/pages/docs.astro` |
| `footer_link_clicked` | User clicked a footer link (with `link` property) | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1751155)
- **Pricing conversion funnel**: [hWcNhJOb](https://us.posthog.com/project/483112/insights/hWcNhJOb) — tracks users from pricing page view through plan selection
- **Trial starts over time**: [lup4XSg0](https://us.posthog.com/project/483112/insights/lup4XSg0) — hero and pro trial button clicks over 30 days
- **Enterprise contact requests**: [ODYPUHvA](https://us.posthog.com/project/483112/insights/ODYPUHvA) — enterprise sales intent over 30 days
- **Feature & pricing page views**: [JDyvyfvh](https://us.posthog.com/project/483112/insights/JDyvyfvh) — top-of-funnel evaluation pages
- **Docs section engagement**: [qJ9TlmTK](https://us.posthog.com/project/483112/insights/qJ9TlmTK) — breakdown of which docs sections users click

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
