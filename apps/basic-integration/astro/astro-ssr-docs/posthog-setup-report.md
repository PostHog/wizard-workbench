# PostHog post-wizard report

PostHog browser analytics has been added to the Astro SSR documentation site. The shared browser initialization is rendered from the root layout and uses Astro `PUBLIC_` environment variables. The PostHog JavaScript and Node SDK packages were added. A reusable server-side singleton is also ready for future Astro API routes; this project currently has no API routes or other server action handlers to instrument, so no server event endpoint was introduced.

| Event name | Description | File |
| --- | --- | --- |
| `documentation_started` | Captures when a visitor starts the documentation from the home page. | `src/pages/index.astro` |
| `documentation_topic_selected` | Captures when a visitor selects a documentation topic from the sidebar. | `src/components/DocsSidebar.astro` |
| `external_repository_opened` | Captures when a visitor opens the project repository from the primary navigation. | `src/components/Navigation.astro` |

## Next steps

The local build completed successfully with `npm run build`.

The PostHog dashboard service was unavailable during setup, so a dashboard, insights, and shareable notebook could not be created. Once the service is available, create **Analytics basics (wizard)** with trends for the three events above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

An agent skill folder remains in the project for future PostHog integration work.
