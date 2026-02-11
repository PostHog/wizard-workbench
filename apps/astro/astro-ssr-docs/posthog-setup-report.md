<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Astro SSR documentation site with PostHog analytics. The integration includes both client-side tracking for user interactions and a server-side PostHog client singleton ready for API route tracking.

## Integration Summary

### Client-side Setup
- Created `src/components/posthog.astro` - PostHog web snippet component with `is:inline` directive to prevent Astro processing
- Added PostHog component to `src/layouts/Layout.astro` head section
- All pages using Layout now automatically have PostHog tracking

### Server-side Setup
- Created `src/lib/posthog-server.ts` - Singleton PostHog client for server-side tracking
- Uses `posthog-node` package for API route event tracking
- Ready to track server-side events with session ID correlation

### Environment Variables
- `PUBLIC_POSTHOG_KEY` - Client-side PostHog API key (exposed to browser)
- `PUBLIC_POSTHOG_HOST` - Client-side PostHog host URL
- `POSTHOG_API_KEY` - Server-side PostHog API key
- `POSTHOG_HOST` - Server-side PostHog host URL

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `docs_cta_clicked` | User clicked the Get Started or API Reference CTA buttons on the homepage hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage to explore documentation sections | `src/pages/index.astro` |
| `sidebar_nav_clicked` | User navigated using the docs sidebar links | `src/components/DocsSidebar.astro` |
| `code_block_copied` | User copied a code example from the documentation | `src/pages/docs/quickstart.astro` |
| `external_link_clicked` | User clicked an external link (e.g., GitHub) in the navigation | `src/components/Navigation.astro` |

## Event Properties

### docs_cta_clicked
- `button_text`: Text content of the clicked button
- `destination`: URL destination of the link
- `location`: Location on the page (e.g., "hero")

### feature_card_clicked
- `card_title`: Title of the feature card
- `destination`: URL destination of the link

### sidebar_nav_clicked
- `link_label`: Label of the sidebar link
- `destination`: URL destination
- `section`: Section title containing the link

### code_block_copied
- `page`: Current page pathname
- `code_index`: Index of the code block on the page
- `code_preview`: First 50 characters of the copied code

### external_link_clicked
- `link_text`: Text of the link
- `destination_url`: External URL
- `location`: Location on the page (e.g., "navigation")

## Next steps

To view your analytics data, visit your PostHog dashboard. You can create insights and dashboards based on the events we've instrumented:

1. **Docs CTA Conversion**: Track which CTA buttons drive the most engagement
2. **Feature Interest Funnel**: See which feature cards users click and where they go next
3. **Navigation Patterns**: Understand how users navigate through documentation
4. **Code Engagement**: Measure which code examples are most valuable to users
5. **External Traffic**: Track clicks to external resources like GitHub

### Creating a Dashboard

To create an "Analytics basics" dashboard in PostHog:
1. Go to your PostHog project dashboard
2. Create a new dashboard named "Analytics basics"
3. Add insights for:
   - Trend: `docs_cta_clicked` events over time
   - Trend: `feature_card_clicked` breakdown by `card_title`
   - Trend: `sidebar_nav_clicked` breakdown by `section`
   - Trend: `code_block_copied` events
   - Funnel: Homepage CTA → Feature Card → Sidebar Navigation

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
