<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI marketing site. Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new) — Client-side PostHog initialization component using the web snippet with `is:inline`. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables.
- **`src/layouts/Layout.astro`** (edited) — Imports and renders `<PostHog />` inside `<head>` so every page in the site initialises PostHog automatically.
- **`src/lib/posthog-server.ts`** (new) — Singleton `posthog-node` client used by API routes. Exposes `getPostHogServer()` (lazy-initialised) and `shutdownPostHog()`.
- **`src/pages/index.astro`** (edited) — Hero CTA buttons tagged with `data-cta` attributes; an inline script captures `cta_clicked` with `cta` and `location` properties on click.
- **`src/pages/pricing.astro`** (edited) — Plan CTA buttons tagged with `data-plan` and `data-price` attributes; an inline script captures `pricing_plan_clicked` with `plan` and `price` properties on click.
- **`src/pages/contact.astro`** (edited) — On form submit, calls `posthog.identify` with the user's email, name, and company, then captures `contact_form_submitted`. Passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API route.
- **`src/pages/api/contact.ts`** (edited) — Server-side route now uses `getPostHogServer()` to capture `contact_form_failed` (on validation errors) and `contact_form_succeeded` (on success), with `$session_id` from the client header for session continuity. Also calls `posthog.identify` server-side to keep person properties up to date.
- **`.env`** (created) — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set from project configuration.

## Events

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicks a hero CTA button (Start Free Trial or Contact Sales) | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form (client-side, fires on submit) | `src/pages/contact.astro` |
| `contact_form_succeeded` | Server successfully processes a contact form submission | `src/pages/api/contact.ts` |
| `contact_form_failed` | Server rejects a contact form submission (validation or server error) | `src/pages/api/contact.ts` |

## Next steps

We recommend building an **Analytics basics** dashboard in PostHog with the following five insights:

1. **CTA clicks over time** — Trends insight on `cta_clicked`, broken down by `cta` property, to see which hero buttons drive the most engagement.
2. **Pricing plan intent** — Trends insight on `pricing_plan_clicked`, broken down by `plan`, to identify which plans attract the most interest.
3. **Contact form conversion funnel** — Funnel insight with steps: `contact_form_submitted` → `contact_form_succeeded`, to measure how many submissions succeed vs. fail.
4. **Contact form submissions over time** — Trends insight on `contact_form_submitted` to track lead volume.
5. **Top interest categories** — Trends insight on `contact_form_succeeded` broken down by `interest`, to understand what prospects want most.

[Create a new dashboard →](/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
