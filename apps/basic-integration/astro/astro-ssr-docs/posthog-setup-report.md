<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow Docs site. The following changes were made:

- **`src/components/posthog.astro`** (new) — PostHog client-side snippet component using `is:inline` to prevent Astro from processing the script. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables.
- **`src/layouts/Layout.astro`** — Imported and mounted the `<PostHog />` component inside `<head>` so analytics loads on every page.
- **`src/lib/posthog-server.ts`** (new) — Singleton `getPostHogServer()` function for server-side `posthog-node` client, ready for any future API routes.
- **`.env`** (new) — PostHog public token and host written for both client (`PUBLIC_` prefix) and server environments.
- **`src/pages/index.astro`** — Tracks CTA and feature card clicks on the homepage.
- **`src/components/Navigation.astro`** — Tracks GitHub link and nav "Get Started" CTA clicks.
- **`src/pages/docs/quickstart.astro`** — Tracks code snippet copies (click-to-copy pattern).
- **`src/pages/docs/installation.astro`** — Tracks SDK install command copies.
- **`src/pages/docs/api/authentication.astro`** — Tracks when visitors reach the Authentication guide (API integration funnel entry).
- **`src/pages/docs/api/endpoints.astro`** — Tracks API endpoint code copies.
- **`src/pages/docs/workflows.astro`** — Tracks workflow code snippet copies.

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the primary 'Get Started' CTA button in the homepage hero section. | `src/pages/index.astro` |
| `api_reference_cta_clicked` | User clicked the 'API Reference' secondary CTA button in the homepage hero section. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked one of the feature cards on the homepage, indicating interest in a specific docs section. | `src/pages/index.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation bar. | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' CTA button in the navigation bar. | `src/components/Navigation.astro` |
| `quickstart_code_copied` | User copied a code snippet from the Quick Start guide, signaling intent to integrate the SDK. | `src/pages/docs/quickstart.astro` |
| `installation_sdk_copied` | User copied an SDK install command from the Installation page, a high-intent conversion signal. | `src/pages/docs/installation.astro` |
| `authentication_guide_started` | User reached the Authentication guide page, indicating they are progressing toward API integration. | `src/pages/docs/api/authentication.astro` |
| `api_endpoint_code_copied` | User copied an API endpoint code snippet from the Endpoints reference page. | `src/pages/docs/api/endpoints.astro` |
| `workflow_code_copied` | User copied a workflow code snippet from the Workflows page. | `src/pages/docs/workflows.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1792363)
- [Homepage CTA clicks](https://us.i.posthog.com/project/483112/insights/jcgSX9Rq)
- [Feature card clicks by section](https://us.i.posthog.com/project/483112/insights/qXvXSgBH)
- [API integration funnel](https://us.i.posthog.com/project/483112/insights/KuEL3YmW)
- [Code snippet copies (docs engagement)](https://us.i.posthog.com/project/483112/insights/SyRkrkAc)
- [Navigation engagement](https://us.i.posthog.com/project/483112/insights/TcI3eCwU)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
