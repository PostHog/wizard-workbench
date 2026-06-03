<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site. PostHog is initialized via a reusable `src/components/posthog.astro` component that is included in the root `Layout.astro`, ensuring every page on the site is covered. All configuration values are read from environment variables (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`) — no keys are hardcoded.

Ten client-side events were added across the homepage, navigation components, and key documentation pages. The events cover the complete developer onboarding journey: from homepage CTAs and feature card exploration, through quickstart and installation page visits, to API and authentication documentation views.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the primary "Get Started" CTA on the homepage hero | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the "API Reference" button on the homepage hero | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage (includes `card_title` property) | `src/pages/index.astro` |
| `github_link_clicked` | User clicked the GitHub link in the site navigation | `src/components/Navigation.astro` |
| `get_started_nav_clicked` | User clicked the "Get Started" CTA in the top navigation bar | `src/components/Navigation.astro` |
| `docs_navigation_clicked` | User clicked a sidebar nav link (includes `section`, `label`, `destination` properties) | `src/components/DocsSidebar.astro` |
| `quickstart_page_viewed` | User viewed the Quick Start guide — top of the developer onboarding funnel | `src/pages/docs/quickstart.astro` |
| `installation_page_viewed` | User viewed the SDK installation page, showing high integration intent | `src/pages/docs/installation.astro` |
| `api_docs_viewed` | User viewed the API overview page, exploring integration options | `src/pages/docs/api/index.astro` |
| `authentication_docs_viewed` | User viewed the authentication docs, showing intent to set up secure API access | `src/pages/docs/api/authentication.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/9886977)
- [Developer onboarding funnel](https://us.posthog.com/project/2/insights/IzkP48mL) — `get_started_clicked` → `quickstart_page_viewed` → `installation_page_viewed`
- [Homepage CTA performance](https://us.posthog.com/project/2/insights/lQnzoVuO) — Trend of `get_started_clicked` and `api_reference_clicked` over time
- [Most popular feature cards](https://us.posthog.com/project/2/insights/SkHiR0a5) — `feature_card_clicked` broken down by `card_title`
- [API adoption funnel](https://us.posthog.com/project/2/insights/ZXM7L2JT) — `api_reference_clicked` → `api_docs_viewed` → `authentication_docs_viewed`
- [Docs navigation patterns](https://us.posthog.com/project/2/insights/gXnesqiA) — Trend of `docs_navigation_clicked` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
