# PostHog post-wizard report

The wizard completed a PostHog integration for this Astro hybrid marketing site. It added browser initialization through a reusable inline snippet, configured the existing shared layout to load it on every page, and added a singleton `posthog-node` client for API-route tracking. The contact API flushes the server-side client before returning so events are delivered in short-lived requests. PostHog configuration is sourced from Astro public environment variables rather than code literals.

The following interaction events were added without including form-entered personal data in event properties:

| Event name | Description | File |
| --- | --- | --- |
| `trial_started` | Captures a visitor starting a free trial from the marketing site. | `src/pages/index.astro` |
| `pricing_plan_selected` | Captures a visitor selecting a pricing plan to begin signup. | `src/pages/pricing.astro` |
| `contact_form_submitted` | Captures a successful contact request with the selected interest category. | `src/pages/contact.astro` |
| `contact_request_received` | Captures a validated contact request on the server with its interest category. | `src/pages/api/contact.ts` |
| `contact_request_failed` | Captures an exception while processing a contact request on the server. | `src/pages/api/contact.ts` |

## Next steps

The dashboard and shareable notebook could not be created because the configured PostHog MCP server was unreachable from this environment. Once connectivity is restored, create the dashboard named **Analytics basics (wizard)** and add insights for the events above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

The PostHog agent skill folder remains in the project for future agent development, providing current framework-specific guidance for this integration.
