# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI Astro (Hybrid) marketing site. The integration adds client-side analytics via the PostHog web snippet in a reusable `posthog.astro` component, and server-side event tracking via `posthog-node` in the `/api/contact` route using a singleton client pattern.

New files created:
- `src/components/posthog.astro` — PostHog web snippet, initialized from env vars, included in the shared layout
- `src/lib/posthog-server.ts` — singleton wrapper for `posthog-node`, used in API routes

Files modified:
- `src/layouts/Layout.astro` — imports and renders the PostHog snippet in `<head>` so all pages are tracked
- `src/pages/index.astro` — CTA click tracking on hero buttons
- `src/pages/pricing.astro` — plan selection tracking on all pricing card CTAs
- `src/pages/contact.astro` — form submission, success identification, and error tracking
- `src/pages/api/contact.ts` — server-side form received/failed tracking and user identification via `posthog-node`

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicks "Start Free Trial" or "Contact Sales" on the home page hero | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a CTA on a pricing card (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form (client-side, before server response) | `src/pages/contact.astro` |
| `contact_form_error` | Contact form submission fails due to a network error | `src/pages/contact.astro` |
| `contact_form_received` | Contact form is successfully processed on the server | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form processing fails on the server (validation or error) | `src/pages/api/contact.ts` |

## Next steps

The PostHog API key used by the wizard was missing `dashboard:write` and `query:read` scopes, so the dashboard could not be created automatically. You can create it manually:

- [Create a new dashboard in PostHog](https://us.posthog.com/project/2/dashboard) — name it **"Analytics basics (wizard)"**

Suggested insights to add:

1. **CTA clicks over time** — Trends: `cta_clicked` broken down by `cta_text` and `location`
2. **Pricing plan selections** — Trends: `pricing_plan_selected` broken down by `plan`
3. **Contact funnel** — Funnel: `cta_clicked` → `contact_form_submitted` → `contact_form_received`
4. **Contact form success rate** — Trends: `contact_form_received` vs `contact_form_failed`
5. **Contact form errors** — Trends: `contact_form_error` broken down by `reason`

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on contact form success, but returning visitors who don't submit the form will remain on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
