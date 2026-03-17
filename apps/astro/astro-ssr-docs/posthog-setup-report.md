<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site. The integration includes:

- **Client-side tracking** via the PostHog JavaScript snippet embedded in the root `Layout.astro` through a reusable `posthog.astro` component.
- **Server-side client** via a `posthog-node` singleton in `src/lib/posthog-server.ts`, ready for use in Astro API routes.
- **10 custom events** tracking user navigation, CTA interactions, and key documentation page views across the site.
- Environment variables set in `.env` using `PUBLIC_` prefix for client-side exposure and no prefix for server-side access, following Astro conventions.

### New files created

| File | Purpose |
|---|---|
| `src/components/posthog.astro` | PostHog JS snippet component (included in every page via Layout) |
| `src/lib/posthog-server.ts` | Server-side PostHog singleton for `posthog-node` |

### Modified files

| File | Change |
|---|---|
| `src/layouts/Layout.astro` | Imports and renders `<PostHog />` in the `<head>` |
| `src/pages/index.astro` | Tracks hero CTA clicks and feature card clicks |
| `src/components/Navigation.astro` | Tracks top nav link clicks |
| `src/components/DocsSidebar.astro` | Tracks sidebar link clicks with section context |
| `src/pages/docs/quickstart.astro` | Tracks quickstart page view and SDK install copy |
| `src/pages/docs/api/index.astro` | Tracks API reference page view |
| `src/pages/docs/api/authentication.astro` | Tracks authentication page view |
| `src/pages/docs/api/endpoints.astro` | Tracks endpoints page view |

---

## Events

| Event Name | Description | File |
|---|---|---|
| `docs_get_started_clicked` | User clicked the 'Get Started' CTA on the homepage hero | `src/pages/index.astro` |
| `docs_api_reference_clicked` | User clicked the 'API Reference' button on the homepage hero | `src/pages/index.astro` |
| `docs_feature_card_clicked` | User clicked a feature card on the homepage | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User viewed the Quick Start page (top of onboarding funnel) | `src/pages/docs/quickstart.astro` |
| `docs_sdk_install_copied` | User clicked the SDK install code block on Quick Start | `src/pages/docs/quickstart.astro` |
| `docs_api_reference_viewed` | User viewed the API Reference overview page | `src/pages/docs/api/index.astro` |
| `docs_authentication_viewed` | User viewed the Authentication documentation page | `src/pages/docs/api/authentication.astro` |
| `docs_endpoints_viewed` | User viewed the API Endpoints reference page | `src/pages/docs/api/endpoints.astro` |
| `docs_nav_link_clicked` | User clicked a link in the top navigation bar | `src/components/Navigation.astro` |
| `docs_sidebar_link_clicked` | User clicked a link in the docs sidebar (with section context) | `src/components/DocsSidebar.astro` |

## Next steps

To visualize user behavior, create an **"Analytics basics"** dashboard in your [PostHog project](https://us.posthog.com/project/2) with the following suggested insights:

1. **Docs onboarding funnel** — Funnel: `docs_get_started_clicked` → `docs_quickstart_viewed` → `docs_sdk_install_copied`
2. **API docs engagement funnel** — Funnel: `docs_api_reference_clicked` → `docs_api_reference_viewed` → `docs_authentication_viewed` → `docs_endpoints_viewed`
3. **Homepage CTA clicks** — Trend: `docs_get_started_clicked` and `docs_api_reference_clicked` over time
4. **Most popular nav/sidebar links** — Breakdown of `docs_sidebar_link_clicked` by `label` property
5. **Feature card engagement** — Breakdown of `docs_feature_card_clicked` by `card_title` property

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
