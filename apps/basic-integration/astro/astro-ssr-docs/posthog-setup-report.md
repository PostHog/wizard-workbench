<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site. Here is a summary of all changes made:

- **`src/components/posthog.astro`** (created): PostHog client-side snippet component initialized from environment variables. Uses `is:inline` to prevent Astro from processing it and `define:vars` to pass `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` safely.
- **`src/lib/posthog-server.ts`** (created): Singleton pattern for the `posthog-node` server-side client, ready for use in any future API routes.
- **`src/layouts/Layout.astro`** (updated): Imports and renders the `PostHog` component inside `<head>`, enabling analytics on every page of the site.
- **`src/pages/index.astro`** (updated): Tracks hero CTA clicks and feature card clicks with relevant properties.
- **`src/components/Navigation.astro`** (updated): Tracks GitHub link clicks and the nav "Get Started" CTA click.
- **`src/pages/docs/quickstart.astro`** (updated): Captures a funnel-top page view event and tracks "What's Next" link clicks.
- **`src/pages/docs/installation.astro`** (updated): Captures a funnel-top page view event.
- **`.env`** (updated): `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` set from project configuration.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the primary "Get Started" CTA in the hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the "API Reference" secondary CTA in the hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage; includes `card_title` and `destination` properties | `src/pages/index.astro` |
| `github_link_clicked` | User clicked the GitHub link in the top navigation | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicked the "Get Started" CTA in the top navigation | `src/components/Navigation.astro` |
| `quickstart_viewed` | User viewed the Quick Start guide (top of SDK adoption funnel) | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User viewed the Installation page (top of SDK setup funnel) | `src/pages/docs/installation.astro` |
| `quickstart_next_steps_clicked` | User clicked a "What's Next" link in the Quick Start guide; includes `destination` and `link_text` properties | `src/pages/docs/quickstart.astro` |

## Next steps

To set up a dashboard for these events, visit PostHog and create an **"Analytics basics"** dashboard with these recommended insights:

- **Homepage CTA conversion** — Trends of `get_started_clicked` and `api_reference_clicked` over time to see which hero CTA drives more engagement.
- **Feature card popularity** — Trends of `feature_card_clicked` broken down by `card_title` to identify which docs section is most in demand.
- **SDK adoption funnel** — Funnel from `quickstart_viewed` → `installation_viewed` → `quickstart_next_steps_clicked` to measure drop-off in the onboarding flow.
- **Navigation intent** — Trends of `nav_get_started_clicked` and `github_link_clicked` to understand developer intent from navigation.
- **Docs engagement** — Trends of `quickstart_next_steps_clicked` broken down by `destination` to see which follow-on docs sections users explore.

You can manage your dashboards at [/dashboard](/dashboard) and create new insights at [/insights](/insights).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
