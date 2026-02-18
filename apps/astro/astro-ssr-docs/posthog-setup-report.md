# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Astro SSR documentation site. The integration includes:

- **Client-side analytics**: PostHog JavaScript snippet initialized via a reusable `posthog.astro` component
- **Server-side support**: A singleton pattern for `posthog-node` client in `src/lib/posthog-server.ts` for API route tracking
- **Environment variables**: Configured with `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST` for client-side and `POSTHOG_API_KEY`, `POSTHOG_HOST` for server-side
- **Event tracking**: Strategic events placed across the documentation site to track user engagement and conversion

## Events Implemented

| Event Name | Description | File(s) |
|------------|-------------|---------|
| `cta_clicked` | User clicked the 'Get Started' CTA button on the homepage hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the 'API Reference' button on the homepage hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked on a feature card to navigate to a specific documentation section | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicked the 'Get Started' navigation CTA button | `src/components/Navigation.astro` |
| `external_link_clicked` | User clicked an external link (e.g., GitHub) | `src/components/Navigation.astro` |
| `sidebar_navigation_clicked` | User clicked a link in the documentation sidebar to navigate between sections | `src/components/DocsSidebar.astro` |
| `code_block_copied` | User copied code from a code block in documentation pages | `src/pages/docs/quickstart.astro`, `src/pages/docs/installation.astro`, `src/pages/docs/workflows.astro`, `src/pages/docs/api/authentication.astro` |

## Files Created/Modified

### New Files
- `src/components/posthog.astro` - PostHog client-side initialization snippet
- `src/lib/posthog-server.ts` - Server-side PostHog singleton client
- `.env` - Environment variables for PostHog configuration

### Modified Files
- `src/layouts/Layout.astro` - Added PostHog component import and usage
- `src/pages/index.astro` - Added CTA and feature card click tracking
- `src/components/Navigation.astro` - Added nav CTA and external link tracking
- `src/components/DocsSidebar.astro` - Added sidebar navigation click tracking
- `src/pages/docs/quickstart.astro` - Added code block copy tracking
- `src/pages/docs/installation.astro` - Added code block copy tracking
- `src/pages/docs/workflows.astro` - Added code block copy tracking
- `src/pages/docs/api/authentication.astro` - Added code block copy tracking

## Next steps

### Recommended Dashboard Insights

Based on the events implemented, we recommend creating the following insights in your PostHog dashboard:

1. **Documentation Engagement Funnel**
   - Track: Homepage visit -> CTA clicked -> Documentation page viewed -> Code block copied
   - This helps understand the conversion journey from landing to active documentation use

2. **Feature Interest Breakdown**
   - Track: `feature_card_clicked` events grouped by `feature` property
   - Understand which documentation sections are most popular

3. **Code Adoption Rate**
   - Track: `code_block_copied` events over time, grouped by `page` and `code_label`
   - Measure how often users copy code snippets to their projects

4. **Navigation Patterns**
   - Track: `sidebar_navigation_clicked` events grouped by `section`
   - Understand how users navigate through documentation

5. **External Engagement**
   - Track: `external_link_clicked` events
   - Monitor traffic to GitHub and other external resources

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Configuration Summary

```bash
# Client-side (PUBLIC_ prefix exposes to browser)
PUBLIC_POSTHOG_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Server-side (no PUBLIC_ prefix, server-only)
POSTHOG_API_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
POSTHOG_HOST=https://us.i.posthog.com
```
