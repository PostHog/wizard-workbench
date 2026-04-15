<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the NeuralFlow documentation site (Astro SSR). Here is a summary of every change made:

- **`src/components/posthog.astro`** (new) — PostHog web snippet component using `define:vars` to inject environment variables safely. Uses `is:inline` to prevent Astro from processing the script and causing TypeScript errors.
- **`src/layouts/Layout.astro`** — Imported `posthog.astro` and added `<PostHog />` inside `<head>`, so analytics loads on every page across the entire site.
- **`src/lib/posthog-server.ts`** (new) — Server-side PostHog singleton using `posthog-node`. Ready to use in any future API routes.
- **`src/pages/index.astro`** — Added click tracking for the hero "Get Started" button, "API Reference" button, and all six feature cards.
- **`src/components/Navigation.astro`** — Added click tracking for the GitHub external link and the "Get Started" nav CTA.
- **`src/components/DocsSidebar.astro`** — Added click tracking on all sidebar navigation links, capturing the link label and href.
- **`src/pages/docs/quickstart.astro`** — Fires `docs_quickstart_viewed` on page load (top of SDK installation funnel).
- **`src/pages/docs/installation.astro`** — Fires `docs_installation_viewed` on page load.
- **`src/pages/docs/api/authentication.astro`** — Fires `docs_authentication_viewed` on page load (signals production-readiness intent).
- **`src/pages/docs/api/endpoints.astro`** — Fires `docs_api_endpoints_viewed` on page load (signals developer integration intent).
- **`.env`** — Added `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" button in the hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" button in the hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage (includes `card_title`, `href`) | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User views the Quick Start guide — top of the SDK installation funnel | `src/pages/docs/quickstart.astro` |
| `docs_installation_viewed` | User views the Installation page — part of the SDK onboarding funnel | `src/pages/docs/installation.astro` |
| `docs_authentication_viewed` | User views Authentication docs — indicates production API interest | `src/pages/docs/api/authentication.astro` |
| `docs_api_endpoints_viewed` | User views API Endpoints reference — signals developer integration intent | `src/pages/docs/api/endpoints.astro` |
| `sidebar_link_clicked` | User clicks a docs sidebar link (includes `label`, `href`) | `src/components/DocsSidebar.astro` |
| `github_link_clicked` | User clicks the GitHub link in the top nav | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicks the "Get Started" CTA in the top nav | `src/components/Navigation.astro` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **SDK Onboarding Funnel** — Funnel insight: `docs_quickstart_viewed` → `docs_installation_viewed` → `docs_authentication_viewed` → `docs_api_endpoints_viewed`
2. **Homepage CTA Clicks** — Trend insight: `get_started_clicked` and `api_reference_clicked` over time
3. **Feature Card Engagement** — Breakdown insight: `feature_card_clicked` broken down by `card_title` property
4. **Docs Navigation Patterns** — Trend insight: `sidebar_link_clicked` broken down by `label` property
5. **External Link Clicks** — Trend insight: `github_link_clicked` and `nav_get_started_clicked` over time

Create your dashboard here: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
