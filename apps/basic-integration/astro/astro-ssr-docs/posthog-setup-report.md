# PostHog post-wizard report

The wizard integrated PostHog into this Astro SSR documentation site. Client analytics initialize from Astro public environment variables in the shared layout, preserving default autocapture and session recording behavior. A server-side `posthog-node` singleton is also available for future API routes, configured for immediate flushing and exception autocapture. The home-page conversion calls to action and external GitHub navigation are instrumented with custom events.

| Event | Description | File |
| --- | --- | --- |
| `docs_get_started_clicked` | A visitor clicks a primary Get Started link to begin reading the documentation. | `src/pages/index.astro` |
| `api_reference_clicked` | A visitor clicks the API Reference call to action from the documentation home page. | `src/pages/index.astro` |
| `github_link_clicked` | A visitor clicks the external GitHub navigation link. | `src/components/Navigation.astro` |

## Next steps

The PostHog dashboard and notebook could not be created because the configured PostHog MCP server was unavailable during setup. Reconnect the server and create an **Analytics basics (wizard)** dashboard using the three events above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
