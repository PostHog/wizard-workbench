<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrackFlow, a client-side SaaS project management dashboard built with Vite and vanilla JavaScript. The integration uses `posthog-node/edge` — the edge-compatible build of the PostHog Node.js SDK — which runs in browser environments via Vite without requiring any Node.js polyfills.

PostHog is initialized in `src/posthog.js` using environment variables from `.env` (`VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`). Event captures are added to `src/api.js` (the central data layer), user identification is added in `src/pages/login.js`, and supplementary captures appear in `src/pages/settings.js`.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user signed in` | A user successfully signed in to the app | `src/pages/login.js` |
| `user signed out` | A user signed out of the app | `src/api.js` |
| `project created` | A new project was created with a name and description | `src/api.js` |
| `project deleted` | A project and all its tasks were deleted | `src/api.js` |
| `task added` | A task was added to a project with a title and priority | `src/api.js` |
| `task status updated` | A task was moved to a different status column on the Kanban board | `src/api.js` |
| `task completed` | A task was marked as done | `src/api.js` |
| `task deleted` | A task was permanently deleted from a project | `src/api.js` |
| `task assigned` | A task was assigned to a team member or unassigned | `src/api.js` |
| `settings updated` | User preferences such as theme or notification settings were changed | `src/api.js` |
| `data reset` | All app data was reset to factory defaults | `src/pages/settings.js` |

## Next steps

We've set up event tracking for all key user actions. To visualize this data, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Sign-in trend** — Trends chart for `user signed in` over time (daily active users proxy)
2. **Project creation funnel** — Funnel: `user signed in` → `project created` → `task added` (measures onboarding conversion)
3. **Task completion trend** — Trends chart for `task completed` over time (measures productivity engagement)
4. **Feature engagement** — Trends with multiple series: `task added`, `task assigned`, `settings updated` (feature breadth)
5. **Churn signals** — Trends chart for `project deleted` and `data reset` (early churn indicators)

- [Dashboards](/dashboard)
- [Create a new insight](/insights)
- [PostHog Node.js SDK docs](https://posthog.com/docs/libraries/node)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
