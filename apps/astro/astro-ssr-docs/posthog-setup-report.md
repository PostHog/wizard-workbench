<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow Documentation site (Astro SSR). The integration adds both client-side and server-side tracking infrastructure.

**Changes made:**

1. **`src/components/posthog.astro`** (new) — Client-side PostHog snippet using `is:inline` with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` env vars. Initialized with `defaults: '2026-01-30'`.
2. **`src/lib/posthog-server.ts`** (new) — Server-side PostHog singleton using `posthog-node`. Reads `POSTHOG_KEY` and `POSTHOG_HOST` from env vars. Exports `getPostHogServer()` and `shutdownPostHog()`.
3. **`src/layouts/Layout.astro`** (edited) — Imports and renders `<PostHog />` in `<head>`. Since all pages use this layout (directly or via `DocsLayout`), every page now loads the PostHog client.
4. **`src/pages/index.astro`** (edited) — Captures hero CTA clicks (`docs_get_started_clicked`, `docs_api_reference_clicked`) and feature card clicks (`docs_feature_card_clicked` with `card_title` and `card_href` properties).
5. **`src/components/Navigation.astro`** (edited) — Captures the "Get Started" nav CTA click (`docs_nav_cta_clicked`).
6. **`src/components/DocsSidebar.astro`** (edited) — Captures sidebar navigation clicks (`docs_sidebar_link_clicked` with `link_label` and `link_href` properties).
7. **`src/pages/docs/index.astro`** (edited) — Fires `docs_page_viewed` with `page: 'introduction'`.
8. **`src/pages/docs/installation.astro`** (edited) — Fires `docs_installation_page_viewed`.
9. **`src/pages/docs/quickstart.astro`** (edited) — Fires `docs_quickstart_sdk_copied` (top of conversion funnel).
10. **`src/pages/docs/concepts.astro`** (edited) — Fires `docs_page_viewed` with `page: 'concepts'`.
11. **`src/pages/docs/workflows.astro`** (edited) — Fires `docs_workflows_page_viewed`.
12. **`src/pages/docs/automation.astro`** (edited) — Fires `docs_automation_page_viewed`.
13. **`src/pages/docs/api/index.astro`** (edited) — Fires `docs_page_viewed` with `page: 'api_overview'`.
14. **`src/pages/docs/api/authentication.astro`** (edited) — Fires `docs_authentication_page_viewed`.
15. **`src/pages/docs/api/endpoints.astro`** (edited) — Fires `docs_api_endpoints_page_viewed`.
16. **`.env`** (created/updated) — Added `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_KEY`, `POSTHOG_HOST`.

| Event Name | Description | File |
|---|---|---|
| `docs_get_started_clicked` | User clicked the hero "Get Started" button | `src/pages/index.astro` |
| `docs_api_reference_clicked` | User clicked the hero "API Reference" button | `src/pages/index.astro` |
| `docs_feature_card_clicked` | User clicked a feature card on the homepage | `src/pages/index.astro` |
| `docs_nav_cta_clicked` | User clicked the "Get Started" CTA in the nav bar | `src/components/Navigation.astro` |
| `docs_sidebar_link_clicked` | User clicked a link in the docs sidebar | `src/components/DocsSidebar.astro` |
| `docs_page_viewed` | User viewed an introduction, concepts, or API overview page | `src/pages/docs/index.astro`, `concepts.astro`, `api/index.astro` |
| `docs_installation_page_viewed` | User viewed the installation page | `src/pages/docs/installation.astro` |
| `docs_quickstart_sdk_copied` | User viewed the quickstart page (top of conversion funnel) | `src/pages/docs/quickstart.astro` |
| `docs_workflows_page_viewed` | User viewed the workflows page | `src/pages/docs/workflows.astro` |
| `docs_automation_page_viewed` | User viewed the automation page | `src/pages/docs/automation.astro` |
| `docs_authentication_page_viewed` | User viewed the authentication API docs | `src/pages/docs/api/authentication.astro` |
| `docs_api_endpoints_page_viewed` | User viewed the API endpoints reference | `src/pages/docs/api/endpoints.astro` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Docs Engagement Funnel** — Funnel: `docs_get_started_clicked` → `docs_installation_page_viewed` → `docs_quickstart_sdk_copied` → `docs_authentication_page_viewed`
2. **Most Visited Docs Pages** — Trend: All `docs_*_page_viewed` events, broken down by event name
3. **Homepage CTA Conversion** — Trend: `docs_get_started_clicked` + `docs_api_reference_clicked` over time
4. **Sidebar Navigation Breakdown** — Trend: `docs_sidebar_link_clicked` broken down by `link_label` property
5. **Feature Card Clicks** — Trend: `docs_feature_card_clicked` broken down by `card_title` property

Navigate to [PostHog → Dashboards → New dashboard](https://us.posthog.com/project/2/dashboard) to create these.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
