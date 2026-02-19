<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). The integration includes:

- **Client-side analytics** via the PostHog JavaScript snippet, loaded on every page through the root layout
- **Server-side PostHog client** using `posthog-node` with a singleton pattern, ready for use in any Astro API routes
- **8 custom events** instrumented across 6 files to track the developer conversion funnel — from first landing on the home page through SDK installation intent
- **Environment variables** configured in `.env` with `PUBLIC_` prefix for client-side and plain prefix for server-side, following Astro conventions

### New files created

| File | Purpose |
|------|---------|
| `src/components/posthog.astro` | PostHog JS snippet component (client-side, `is:inline`) |
| `src/lib/posthog-server.ts` | `posthog-node` singleton for server-side tracking in API routes |
| `.env` | PostHog API key and host environment variables |

### Files modified

| File | Change |
|------|--------|
| `src/layouts/Layout.astro` | Added `<PostHog />` component to `<head>` for site-wide analytics |
| `src/pages/index.astro` | Added CTA and feature card click tracking |
| `src/components/Navigation.astro` | Added GitHub link click tracking |
| `src/pages/docs/installation.astro` | Added install command copy tracking |
| `src/pages/docs/quickstart.astro` | Added quickstart completion + install copy tracking |
| `src/pages/docs/api/authentication.astro` | Added API key docs view tracking |
| `src/pages/docs/workflows.astro` | Added workflow docs view tracking |

---

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" hero CTA — top of the conversion funnel | `src/pages/index.astro` |
| `api_reference_cta_clicked` | User clicks the "API Reference" secondary hero CTA — API integration intent | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the home page (properties: `section`, `destination`) | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the navigation bar | `src/components/Navigation.astro` |
| `install_command_copied` | User copies an SDK install command (properties: `command`, `page`) | `src/pages/docs/installation.astro`, `src/pages/docs/quickstart.astro` |
| `quickstart_next_steps_viewed` | User scrolls to and views the "What's Next" section — indicates quickstart completion | `src/pages/docs/quickstart.astro` |
| `api_key_docs_viewed` | User views the authentication/API key documentation — high integration intent | `src/pages/docs/api/authentication.astro` |
| `workflow_docs_viewed` | User views workflow automation docs — deeper product engagement signal | `src/pages/docs/workflows.astro` |

---

## Next steps

### Create your analytics dashboard

To build the recommended "Analytics basics" dashboard in PostHog, visit your project and create a new dashboard with these 5 insights:

1. **Docs Conversion Funnel** — Funnel: `get_started_clicked` → `quickstart_next_steps_viewed` → `api_key_docs_viewed` → `install_command_copied`
2. **Top Feature Card Clicks** — Trends bar chart: `feature_card_clicked` broken down by `section` property
3. **Developer Engagement Trend** — Trends line: `install_command_copied` + `github_link_clicked` over time
4. **Workflow & API Engagement** — Trends line: `workflow_docs_viewed` + `api_key_docs_viewed` over time
5. **Home CTA Performance** — Trends bar: `get_started_clicked` + `api_reference_cta_clicked` side by side

**[→ Create a new dashboard in PostHog](https://us.posthog.com/project/2/dashboard/new)**

### Use the server-side client in API routes

When you add API routes to this project, import and use the server singleton:

```typescript
import { getPostHogServer } from '../../../lib/posthog-server';

export const POST: APIRoute = async ({ request }) => {
  const posthog = getPostHogServer();
  const sessionId = request.headers.get('X-PostHog-Session-Id');

  posthog.capture({
    distinctId: 'user-id',
    event: 'api_action_performed',
    properties: {
      $session_id: sessionId || undefined,
    },
  });
  // ...
};
```

Pass the session ID from the client via `X-PostHog-Session-Id` header for unified session tracking.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
